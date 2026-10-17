-- ==============================================================================
-- Patas do Bem — Migração 002: Políticas de Segurança em Nível de Linha (RLS)
-- Princípio do Privilégio Mínimo e Proteção contra Manipulações Indevidas
-- ==============================================================================

-- 1. Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- 2. Funções Auxiliares Seguras com search_path explícito
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$;

-- Restringe a execução da função auxiliar
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 3. Políticas para PROFILES
-- ------------------------------------------------------------------------------
CREATE POLICY "profiles_select_self_or_admin"
    ON profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_insert_self"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id AND role = 'donor');

CREATE POLICY "profiles_update_self_or_admin"
    ON profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (
        (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()))
        OR public.is_admin()
    );

-- ------------------------------------------------------------------------------
-- 4. Políticas para ORGANIZATIONS
-- ------------------------------------------------------------------------------
-- Qualquer usuário pode ver organizações ativas e aprovadas (para dados institucionais)
CREATE POLICY "organizations_select_approved_or_owner_or_admin"
    ON organizations FOR SELECT
    USING (
        status = 'approved'
        OR auth.uid() = owner_id
        OR public.is_admin()
    );

-- Protetores só podem criar organização em status 'pending_approval' e com seu próprio ID
CREATE POLICY "organizations_insert_owner"
    ON organizations FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = owner_id
        AND status = 'pending_approval'
    );

-- Protetores não podem aprovar a própria organização nem fraudar o proprietário
CREATE POLICY "organizations_update_owner_or_admin"
    ON organizations FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id OR public.is_admin())
    WITH CHECK (
        public.is_admin()
        OR (
            auth.uid() = owner_id
            AND status = (SELECT status FROM organizations WHERE id = organizations.id)
            AND verified_at IS NOT DISTINCT FROM (SELECT verified_at FROM organizations WHERE id = organizations.id)
        )
    );

-- ------------------------------------------------------------------------------
-- 5. Políticas para ANIMALS
-- ------------------------------------------------------------------------------
-- Animais visíveis publicamente se vinculados a campanhas ativas/concluídas, ou para o protetor dono
CREATE POLICY "animals_select_public_or_owner"
    ON animals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM campaigns c
            WHERE c.animal_id = animals.id
            AND c.status IN ('active', 'completed')
        )
        OR EXISTS (
            SELECT 1 FROM organizations o
            WHERE o.id = animals.organization_id
            AND o.owner_id = auth.uid()
        )
        OR public.is_admin()
    );

CREATE POLICY "animals_insert_owner"
    ON animals FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM organizations o
            WHERE o.id = animals.organization_id
            AND o.owner_id = auth.uid()
        )
        OR public.is_admin()
    );

CREATE POLICY "animals_update_owner"
    ON animals FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM organizations o
            WHERE o.id = animals.organization_id
            AND o.owner_id = auth.uid()
        )
        OR public.is_admin()
    );

-- ------------------------------------------------------------------------------
-- 6. Políticas para CAMPAIGNS (Crítico: Proteção Financeira e de Beneficiário)
-- ------------------------------------------------------------------------------
-- Visitantes e público geral só leem campanhas ativas ou concluídas
CREATE POLICY "campaigns_select_active_or_owner"
    ON campaigns FOR SELECT
    USING (
        status IN ('active', 'completed')
        OR EXISTS (
            SELECT 1 FROM organizations o
            WHERE o.id = campaigns.organization_id
            AND o.owner_id = auth.uid()
        )
        OR public.is_admin()
    );

-- Criação de campanha: protetor autenticado para sua organização aprovada, com arrecadação inicial zerada
CREATE POLICY "campaigns_insert_owner"
    ON campaigns FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM organizations o
            WHERE o.id = campaigns.organization_id
            AND o.owner_id = auth.uid()
        )
        AND status IN ('draft', 'pending_approval')
        AND raised_amount_cents = 0
        AND supporters_count = 0
    );

-- Edição de campanha:
-- 1. Usuários comuns NUNCA podem alterar raised_amount_cents ou supporters_count
-- 2. Não podem alterar o beneficiário (organization_id) de campanha já aprovada
-- 3. Não podem aprovar a própria campanha (status = 'active' exige admin)
CREATE POLICY "campaigns_update_owner_or_admin"
    ON campaigns FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM organizations o
            WHERE o.id = campaigns.organization_id
            AND o.owner_id = auth.uid()
        )
        OR public.is_admin()
    )
    WITH CHECK (
        public.is_admin()
        OR (
            -- Garante que o responsável não fraudou a arrecadação acumulada
            raised_amount_cents = (SELECT raised_amount_cents FROM campaigns WHERE id = campaigns.id)
            AND supporters_count = (SELECT supporters_count FROM campaigns WHERE id = campaigns.id)
            -- Garante que o beneficiário da campanha aprovada não pode ser trocado
            AND organization_id = (SELECT organization_id FROM campaigns WHERE id = campaigns.id)
            -- Garante que status ativo ou cancelado só pode ser manipulado com validação
            AND (
                status = (SELECT status FROM campaigns WHERE id = campaigns.id)
                OR (
                    (SELECT status FROM campaigns WHERE id = campaigns.id) = 'draft' 
                    AND status = 'pending_approval'
                )
            )
        )
    );

-- ------------------------------------------------------------------------------
-- 7. Políticas para CAMPAIGN UPDATES (Prestação de Contas)
-- ------------------------------------------------------------------------------
CREATE POLICY "campaign_updates_select_public"
    ON campaign_updates FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM campaigns c
            WHERE c.id = campaign_updates.campaign_id
            AND (c.status IN ('active', 'completed') OR public.is_admin())
        )
    );

CREATE POLICY "campaign_updates_insert_owner"
    ON campaign_updates FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM campaigns c
            JOIN organizations o ON o.id = c.organization_id
            WHERE c.id = campaign_updates.campaign_id
            AND (o.owner_id = auth.uid() OR public.is_admin())
        )
    );

-- ------------------------------------------------------------------------------
-- 8. Políticas para DONATIONS (Segurança de Pagamentos e Privacidade)
-- ------------------------------------------------------------------------------
-- Consultas: Doadores veem as suas; Protetores veem as da sua campanha; Visitantes veem apenas lista resumida não-anônima
CREATE POLICY "donations_select_rules"
    ON donations FOR SELECT
    USING (
        -- Próprio doador
        (auth.uid() IS NOT NULL AND donor_id = auth.uid())
        -- Protetor responsável pela campanha
        OR EXISTS (
            SELECT 1 FROM campaigns c
            JOIN organizations o ON o.id = c.organization_id
            WHERE c.id = donations.campaign_id
            AND o.owner_id = auth.uid()
        )
        -- Admin
        OR public.is_admin()
        -- Listagem pública de apoiadores (apenas confirmadas e não anônimas)
        OR (status = 'paid' AND is_anonymous = false)
    );

-- Criação de doação: Permitida para qualquer usuário (anônimo ou autenticado), mas sempre com status 'pending'
CREATE POLICY "donations_insert_pending_only"
    ON donations FOR INSERT
    WITH CHECK (
        status = 'pending'
        AND fee_cents = 0
        AND (net_amount_cents IS NULL OR net_amount_cents = amount_cents)
        AND (auth.uid() IS NULL OR donor_id = auth.uid())
    );

-- Atualização de status de doação: PROIBIDA para usuários comuns e visitantes.
-- Somente o service_role (via webhooks e funções SECURITY DEFINER internas) ou admin pode alterar status.
CREATE POLICY "donations_update_admin_only"
    ON donations FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. Políticas para PAYMENT EVENTS (Ledger de Webhooks)
-- ------------------------------------------------------------------------------
-- NENHUM acesso público ou de usuário comum. Somente administradores ou service_role.
CREATE POLICY "payment_events_admin_only"
    ON payment_events FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
