-- ==============================================================================
-- Patas do Bem — Migração 004: Correções e Endurecimento de Segurança (Hardening)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CORREÇÃO DE PRIVACIDADE: ORGANIZAÇÕES (Ocultação Estrita de CPF/CNPJ e PIX)
-- ------------------------------------------------------------------------------

-- Remover política anterior que concedia leitura pública à tabela organizations
DROP POLICY IF EXISTS "organizations_select_approved_or_owner_or_admin" ON organizations;

-- Revogar permissão ampla de SELECT da tabela organizations para visitantes e usuários normais
REVOKE SELECT ON organizations FROM anon;
REVOKE SELECT ON organizations FROM authenticated;

-- Conceder SELECT apenas para authenticated (para ser filtrado estritamente por RLS)
GRANT SELECT ON organizations TO authenticated;

-- Nova política: Apenas o proprietário da organização e administradores leem a tabela organizations
CREATE POLICY "organizations_select_owner_or_admin"
    ON organizations FOR SELECT
    TO authenticated
    USING (auth.uid() = owner_id OR public.is_admin());

-- Recriar a view pública com security_invoker = false (executa com privilégios de seu criador)
-- Expondo estritamente colunas públicas e não confidenciais de organizações aprovadas
CREATE OR REPLACE VIEW public_organizations 
WITH (security_invoker = false) AS
SELECT 
    id,
    name,
    type,
    city,
    state,
    bio,
    status,
    verified_at,
    created_at
FROM organizations
WHERE status = 'approved';

-- Conceder leitura da view pública para visitantes e autenticados
GRANT SELECT ON public_organizations TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 2. CORREÇÃO DE PRIVACIDADE: DOAÇÕES (Ocultação de E-mails e Referências de Gateway)
-- ------------------------------------------------------------------------------

-- Remover política anterior que expunha registros completos da tabela donations para visitantes
DROP POLICY IF EXISTS "donations_select_rules" ON donations;

-- Revogar acesso direto de leitura da tabela donations para visitantes anônimos
REVOKE SELECT ON donations FROM anon;
GRANT SELECT ON donations TO authenticated;

-- Nova política: Apenas o próprio doador, o protetor da campanha e administradores leem a tabela donations
CREATE POLICY "donations_select_authorized"
    ON donations FOR SELECT
    TO authenticated
    USING (
        -- Próprio doador autenticado
        (donor_id = auth.uid())
        -- Protetor responsável pela organização da campanha
        OR EXISTS (
            SELECT 1 FROM campaigns c
            JOIN organizations o ON o.id = c.organization_id
            WHERE c.id = donations.campaign_id
            AND o.owner_id = auth.uid()
        )
        -- Administradores
        OR public.is_admin()
    );

-- Criar view pública para listagem de apoiadores de campanhas
-- Oculta rigorosamente donor_email, external_reference_id e doações anônimas
CREATE OR REPLACE VIEW public_donations
WITH (security_invoker = false) AS
SELECT 
    id,
    campaign_id,
    amount_cents,
    donor_display_name,
    created_at,
    paid_at
FROM donations
WHERE status = 'paid' AND is_anonymous = false;

-- Conceder leitura da view pública de apoiadores
GRANT SELECT ON public_donations TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 3. RLS: BLOQUEIO DE DOAÇÕES PARA CAMPANHAS INATIVAS
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS "donations_insert_pending_only" ON donations;

CREATE POLICY "donations_insert_pending_only"
    ON donations FOR INSERT
    WITH CHECK (
        status = 'pending'
        AND fee_cents = 0
        AND (net_amount_cents IS NULL OR net_amount_cents = amount_cents)
        AND (auth.uid() IS NULL OR donor_id = auth.uid())
        -- Garante que a campanha existe e está em status 'active'
        AND EXISTS (
            SELECT 1 FROM campaigns c
            WHERE c.id = donations.campaign_id
            AND c.status = 'active'
        )
    );

-- ------------------------------------------------------------------------------
-- 4. RLS: PROTEÇÃO CONTRA ALTERAÇÃO DE METAS E CONTEÚDO EM CAMPANHAS APROVADAS
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS "campaigns_update_owner_or_admin" ON campaigns;

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
            -- 1. Saldo e apoiadores NUNCA podem ser alterados pelo cliente
            raised_amount_cents = (SELECT raised_amount_cents FROM campaigns WHERE id = campaigns.id)
            AND supporters_count = (SELECT supporters_count FROM campaigns WHERE id = campaigns.id)
            
            -- 2. Beneficiário (organização) NUNCA pode ser transferido
            AND organization_id = (SELECT organization_id FROM campaigns WHERE id = campaigns.id)

            -- 3. Se a campanha já estiver ativa, concluída ou pausada:
            -- Meta financeira, animal associado e categoria tornam-se IMUTÁVEIS para o protetor
            AND (
                CASE 
                    WHEN (SELECT status FROM campaigns WHERE id = campaigns.id) IN ('active', 'completed', 'paused') THEN
                        target_amount_cents = (SELECT target_amount_cents FROM campaigns WHERE id = campaigns.id)
                        AND animal_id = (SELECT animal_id FROM campaigns WHERE id = campaigns.id)
                        AND category = (SELECT category FROM campaigns WHERE id = campaigns.id)
                        AND status = (SELECT status FROM campaigns WHERE id = campaigns.id)
                    ELSE
                        -- Em rascunho (draft), pode alterar dados e avançar para 'pending_approval'
                        (status = (SELECT status FROM campaigns WHERE id = campaigns.id)
                         OR (
                            (SELECT status FROM campaigns WHERE id = campaigns.id) = 'draft' 
                            AND status = 'pending_approval'
                         ))
                END
            )
        )
    );

-- ------------------------------------------------------------------------------
-- 5. PERMISSÕES DA FUNÇÃO is_admin() PARA COMPATIBILIDADE COM CONSULTAS ANON
-- ------------------------------------------------------------------------------

-- Concede execução segura para a role 'anon' para evitar erro em tempo de execução
-- quando o planejador do PostgreSQL avalia cláusulas OR public.is_admin()
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 6. AUTENTICAÇÃO: CRIAÇÃO AUTOMÁTICA DE PERFIL (TRIGGER NO auth.users)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Doador'),
        NEW.raw_user_meta_data->>'phone',
        'donor'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Garante que um erro ao gerar perfil não impeça a criação da conta de autenticação
    RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

-- Vincular gatilho à tabela auth.users se a tabela existir
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        CREATE OR REPLACE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 7. REVISÃO DO PROCESSADOR DE WEBHOOKS (Validação de Eventos, Reembolsos e Moeda)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.process_payment_webhook_idempotent(
    p_gateway TEXT,
    p_event_id TEXT,
    p_event_type TEXT,
    p_external_reference_id TEXT,
    p_amount_cents BIGINT,
    p_fee_cents BIGINT,
    p_payload JSONB,
    p_currency TEXT DEFAULT 'BRL'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_event_id UUID;
    v_existing_status payment_event_status;
    v_donation RECORD;
    v_net_cents BIGINT;
    v_normalized_event TEXT;
BEGIN
    -- 1. Validação estrita de parâmetros de entrada
    IF p_gateway IS NULL OR btrim(p_gateway) = '' THEN
        RAISE EXCEPTION 'Parâmetro p_gateway é obrigatório';
    END IF;

    IF p_event_id IS NULL OR btrim(p_event_id) = '' THEN
        RAISE EXCEPTION 'Parâmetro p_event_id é obrigatório';
    END IF;

    IF p_event_type IS NULL OR btrim(p_event_type) = '' THEN
        RAISE EXCEPTION 'Parâmetro p_event_type é obrigatório';
    END IF;

    IF p_external_reference_id IS NULL OR btrim(p_external_reference_id) = '' THEN
        RAISE EXCEPTION 'Parâmetro p_external_reference_id é obrigatório';
    END IF;

    IF p_amount_cents IS NULL OR p_amount_cents <= 0 THEN
        RAISE EXCEPTION 'Parâmetro p_amount_cents deve ser maior que zero';
    END IF;

    IF COALESCE(p_currency, 'BRL') <> 'BRL' THEN
        RAISE EXCEPTION 'Moeda % não suportada pela plataforma. Somente BRL é aceito.', p_currency;
    END IF;

    v_normalized_event := upper(btrim(p_event_type));

    -- 2. Registro no Ledger de Eventos com tratamento de concorrência
    INSERT INTO public.payment_events (
        gateway,
        event_id,
        event_type,
        external_reference_id,
        payload,
        status
    )
    VALUES (
        p_gateway,
        p_event_id,
        v_normalized_event,
        p_external_reference_id,
        COALESCE(p_payload, '{}'::jsonb),
        'received'
    )
    ON CONFLICT (gateway, event_id) DO NOTHING
    RETURNING id INTO v_event_id;

    -- Se não retornou id, o evento já existe (idempotência)
    IF v_event_id IS NULL THEN
        SELECT id, status INTO v_event_id, v_existing_status
        FROM public.payment_events
        WHERE gateway = p_gateway AND event_id = p_event_id
        FOR UPDATE;

        IF v_existing_status = 'processed' THEN
            RETURN jsonb_build_object(
                'success', true,
                'is_duplicate', true,
                'message', 'Evento repetido já processado com sucesso anteriormente.'
            );
        END IF;
    END IF;

    -- 3. Localizar a doação com bloqueio exclusivo (FOR UPDATE)
    SELECT * INTO v_donation
    FROM public.donations
    WHERE external_reference_id = p_external_reference_id
    FOR UPDATE;

    IF NOT FOUND THEN
        UPDATE public.payment_events
        SET status = 'failed',
            error_message = 'Doação associada ao external_reference_id não encontrada',
            processed_at = now()
        WHERE id = v_event_id;

        RETURN jsonb_build_object(
            'success', false,
            'is_duplicate', false,
            'message', 'Doação não encontrada.'
        );
    END IF;

    -- 4. Tratamento por Categoria de Evento do Gateway

    -- A) EVENTO DE CONFIRMAÇÃO DE PAGAMENTO
    IF v_normalized_event IN ('PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED') THEN
        
        -- Se já estava paga, idempotência ativada sem recontar
        IF v_donation.status = 'paid' THEN
            UPDATE public.payment_events
            SET status = 'processed',
                processed_at = now()
            WHERE id = v_event_id;

            RETURN jsonb_build_object(
                'success', true,
                'is_duplicate', true,
                'message', 'Doação já se encontrava com status paid. Nenhum incremento duplicado realizado.'
            );
        END IF;

        -- Validação de valor: montante pago não pode ser inferior ao valor esperado da doação
        IF p_amount_cents < v_donation.amount_cents THEN
            UPDATE public.payment_events
            SET status = 'failed',
                error_message = format('Valor pago (%s centavos) inferior ao valor registrado da doação (%s centavos)', p_amount_cents, v_donation.amount_cents),
                processed_at = now()
            WHERE id = v_event_id;

            RETURN jsonb_build_object(
                'success', false,
                'is_duplicate', false,
                'message', 'Valor de pagamento divergente da doação.'
            );
        END IF;

        -- Atualização Atômica (Doação + Campanha na mesma transação)
        v_net_cents := p_amount_cents - COALESCE(p_fee_cents, 0);

        UPDATE public.donations
        SET status = 'paid',
            paid_at = now(),
            fee_cents = COALESCE(p_fee_cents, 0),
            net_amount_cents = v_net_cents,
            updated_at = now()
        WHERE id = v_donation.id;

        UPDATE public.campaigns
        SET raised_amount_cents = raised_amount_cents + v_donation.amount_cents,
            supporters_count = supporters_count + 1,
            updated_at = now()
        WHERE id = v_donation.campaign_id;

        UPDATE public.payment_events
        SET status = 'processed',
            processed_at = now(),
            error_message = NULL
        WHERE id = v_event_id;

        RETURN jsonb_build_object(
            'success', true,
            'action', 'payment_confirmed',
            'is_duplicate', false,
            'donation_id', v_donation.id,
            'campaign_id', v_donation.campaign_id
        );

    -- B) EVENTO DE REEMBOLSO OU ESTORNO (REFUND / CHARGEBACK)
    ELSIF v_normalized_event IN ('PAYMENT_REFUNDED', 'PAYMENT_CHARGEBACK') THEN
        
        -- Só decrementa a campanha se a doação estava anteriormente computada como 'paid'
        IF v_donation.status = 'paid' THEN
            UPDATE public.donations
            SET status = 'refunded',
                updated_at = now()
            WHERE id = v_donation.id;

            UPDATE public.campaigns
            SET raised_amount_cents = GREATEST(0, raised_amount_cents - v_donation.amount_cents),
                supporters_count = GREATEST(0, supporters_count - 1),
                updated_at = now()
            WHERE id = v_donation.campaign_id;

            UPDATE public.payment_events
            SET status = 'processed',
                processed_at = now(),
                error_message = NULL
            WHERE id = v_event_id;

            RETURN jsonb_build_object(
                'success', true,
                'action', 'refund_processed',
                'is_duplicate', false,
                'donation_id', v_donation.id,
                'message', 'Reembolso processado e arrecadação estornada atomicamente.'
            );
        ELSE
            -- Se não estava paga, apenas marca doação como refunded sem alterar saldo da campanha
            UPDATE public.donations
            SET status = 'refunded',
                updated_at = now()
            WHERE id = v_donation.id;

            UPDATE public.payment_events
            SET status = 'processed',
                processed_at = now()
            WHERE id = v_event_id;

            RETURN jsonb_build_object(
                'success', true,
                'action', 'refund_recorded_no_decrement',
                'is_duplicate', false,
                'message', 'Doação não estava paga; nenhum saldo precisou ser debitado da campanha.'
            );
        END IF;

    -- C) EVENTOS DE FALHA OU CANCELAMENTO
    ELSIF v_normalized_event IN ('PAYMENT_FAILED', 'PAYMENT_CANCELLED') THEN
        
        IF v_donation.status = 'pending' THEN
            UPDATE public.donations
            SET status = CASE WHEN v_normalized_event = 'PAYMENT_FAILED' THEN 'failed'::donation_status ELSE 'cancelled'::donation_status END,
                updated_at = now()
            WHERE id = v_donation.id;
        END IF;

        UPDATE public.payment_events
        SET status = 'processed',
            processed_at = now()
        WHERE id = v_event_id;

        RETURN jsonb_build_object(
            'success', true,
            'action', 'failure_recorded',
            'is_duplicate', false,
            'message', 'Evento de falha registrado sem impacto no saldo da campanha.'
        );

    -- D) EVENTOS INFORMATIVOS NÃO FINANCEIROS
    ELSE
        UPDATE public.payment_events
        SET status = 'processed',
            processed_at = now()
        WHERE id = v_event_id;

        RETURN jsonb_build_object(
            'success', true,
            'action', 'ignored_informational',
            'is_duplicate', false,
            'message', 'Evento informativo registrado no ledger sem alteração de saldo.'
        );
    END IF;

EXCEPTION WHEN OTHERS THEN
    IF v_event_id IS NOT NULL THEN
        UPDATE public.payment_events
        SET status = 'failed',
            error_message = SQLERRM,
            processed_at = now()
        WHERE id = v_event_id;
    END IF;

    RAISE;
END;
$$;

-- Blindagem estrita das permissões de execução
REVOKE ALL ON FUNCTION public.process_payment_webhook_idempotent FROM PUBLIC;
REVOKE ALL ON FUNCTION public.process_payment_webhook_idempotent FROM anon;
REVOKE ALL ON FUNCTION public.process_payment_webhook_idempotent FROM authenticated;

GRANT EXECUTE ON FUNCTION public.process_payment_webhook_idempotent TO service_role;
