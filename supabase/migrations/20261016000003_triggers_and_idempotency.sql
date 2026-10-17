-- ==============================================================================
-- Patas do Bem — Migração 003: Gatilhos de Integridade e Idempotência de Pagamentos
-- ==============================================================================

-- 1. Função Genérica para Atualização Automática de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO postgres, service_role;

-- Triggers de updated_at
CREATE OR REPLACE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_animals_updated_at
    BEFORE UPDATE ON animals
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_donations_updated_at
    BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 2. Processador Transacional e Idempotente de Webhooks de Pagamento
-- ------------------------------------------------------------------------------
-- REQUISITOS CRÍTICOS ATENDIDOS:
-- - search_path seguro: 'public, pg_temp'
-- - Execução restrita: REVOKE de PUBLIC, anon e authenticated; GRANT apenas para service_role
-- - Atomicidade: Doação e Campanha atualizadas na MESMA transação
-- - Idempotência estrita: Concorrência e eventos repetidos são bloqueados e não re-incrementam valores
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.process_payment_webhook_idempotent(
    p_gateway TEXT,
    p_event_id TEXT,
    p_event_type TEXT,
    p_external_reference_id TEXT,
    p_amount_cents BIGINT,
    p_fee_cents BIGINT,
    p_payload JSONB
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
BEGIN
    -- Validação inicial estrita dos parâmetros
    IF p_gateway IS NULL OR btrim(p_gateway) = '' THEN
        RAISE EXCEPTION 'Parâmetro p_gateway é obrigatório';
    END IF;

    IF p_event_id IS NULL OR btrim(p_event_id) = '' THEN
        RAISE EXCEPTION 'Parâmetro p_event_id é obrigatório';
    END IF;

    IF p_external_reference_id IS NULL OR btrim(p_external_reference_id) = '' THEN
        RAISE EXCEPTION 'Parâmetro p_external_reference_id é obrigatório';
    END IF;

    IF p_amount_cents IS NULL OR p_amount_cents <= 0 THEN
        RAISE EXCEPTION 'Parâmetro p_amount_cents deve ser maior que zero';
    END IF;

    -- 1. Tentativa de inserção atômica com chave única (gateway, event_id)
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
        p_event_type,
        p_external_reference_id,
        COALESCE(p_payload, '{}'::jsonb),
        'received'
    )
    ON CONFLICT (gateway, event_id) DO NOTHING
    RETURNING id INTO v_event_id;

    -- 2. Se não retornou id, o evento já foi registrado anteriormente (idempotência)
    IF v_event_id IS NULL THEN
        SELECT id, status INTO v_event_id, v_existing_status
        FROM public.payment_events
        WHERE gateway = p_gateway AND event_id = p_event_id
        FOR UPDATE; -- Bloqueio de linha para tratar chamadas concorrentes simultâneas

        IF v_existing_status = 'processed' THEN
            RETURN jsonb_build_object(
                'success', true,
                'is_duplicate', true,
                'message', 'Evento já processado anteriormente. Nenhuma ação repetida necessária.'
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
            error_message = 'Doação correspondente ao external_reference_id não encontrada',
            processed_at = now()
        WHERE id = v_event_id;

        RETURN jsonb_build_object(
            'success', false,
            'is_duplicate', false,
            'message', 'Doação não encontrada para o external_reference_id informado.'
        );
    END IF;

    -- 4. Verificar se a doação já estava paga (para evitar recontagem mesmo se o event_id for novo)
    IF v_donation.status = 'paid' THEN
        UPDATE public.payment_events
        SET status = 'processed',
            processed_at = now()
        WHERE id = v_event_id;

        RETURN jsonb_build_object(
            'success', true,
            'is_duplicate', true,
            'message', 'Doação já constava como paga. Valores da campanha não foram re-incrementados.'
        );
    END IF;

    -- 5. Atualização atômica da Doação e da Campanha na MESMA transação
    v_net_cents := p_amount_cents - COALESCE(p_fee_cents, 0);

    UPDATE public.donations
    SET status = 'paid',
        paid_at = now(),
        fee_cents = COALESCE(p_fee_cents, 0),
        net_amount_cents = v_net_cents,
        updated_at = now()
    WHERE id = v_donation.id;

    -- Incremento atômico protegido no banco (navegador não consegue alterar)
    UPDATE public.campaigns
    SET raised_amount_cents = raised_amount_cents + v_donation.amount_cents,
        supporters_count = supporters_count + 1,
        updated_at = now()
    WHERE id = v_donation.campaign_id;

    -- 6. Marcar o evento como processado com sucesso
    UPDATE public.payment_events
    SET status = 'processed',
        processed_at = now(),
        error_message = NULL
    WHERE id = v_event_id;

    RETURN jsonb_build_object(
        'success', true,
        'is_duplicate', false,
        'donation_id', v_donation.id,
        'campaign_id', v_donation.campaign_id,
        'amount_cents', v_donation.amount_cents,
        'message', 'Pagamento confirmado e arrecadação atualizada atomicamente com sucesso.'
    );

EXCEPTION WHEN OTHERS THEN
    -- Em caso de erro imprevisto, registra a falha no evento se existir
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

-- ------------------------------------------------------------------------------
-- 3. Blindagem de Permissões da Função de Pagamento
-- ------------------------------------------------------------------------------
-- Revoga execução de papéis públicos, anônimos e autenticados comuns
REVOKE ALL ON FUNCTION public.process_payment_webhook_idempotent FROM PUBLIC;
REVOKE ALL ON FUNCTION public.process_payment_webhook_idempotent FROM anon;
REVOKE ALL ON FUNCTION public.process_payment_webhook_idempotent FROM authenticated;

-- Garante execução estrita e exclusiva ao service_role do Supabase
GRANT EXECUTE ON FUNCTION public.process_payment_webhook_idempotent TO service_role;
