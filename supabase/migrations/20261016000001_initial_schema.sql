-- ==============================================================================
-- Patas do Bem — Migração 001: Esquema Inicial de Dados
-- ==============================================================================

-- 1. Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Definição de Tipos Enumerados (Enums)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('donor', 'rescuer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE organization_type AS ENUM ('independent', 'ong');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE organization_status AS ENUM ('pending_approval', 'approved', 'suspended', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE animal_species AS ENUM ('dog', 'cat', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE animal_status AS ENUM ('under_treatment', 'recovered', 'adopted', 'deceased');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_category AS ENUM ('surgery', 'treatment', 'food', 'shelter', 'emergency');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_urgency AS ENUM ('high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('draft', 'pending_approval', 'active', 'paused', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE donation_status AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('pix', 'credit_card');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_event_status AS ENUM ('received', 'processed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Tabela de Perfis de Usuários (Profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'donor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tabela de Organizações e Protetores (Organizations)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    type organization_type NOT NULL DEFAULT 'independent',
    document TEXT NOT NULL, -- CPF ou CNPJ (dado sensível protegido via RLS e views)
    city TEXT NOT NULL,
    state VARCHAR(2) NOT NULL,
    bio TEXT,
    pix_key TEXT, -- Chave PIX (dado sensível restrito a proprietário/admin)
    bank_account_info JSONB, -- Dados bancários protegidos
    status organization_status NOT NULL DEFAULT 'pending_approval',
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Tabela de Animais Acolhidos (Animals)
CREATE TABLE IF NOT EXISTS animals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species animal_species NOT NULL,
    breed TEXT DEFAULT 'Sem Raça Definida (SRD)',
    approximate_age TEXT,
    medical_history TEXT,
    photo_url TEXT,
    status animal_status NOT NULL DEFAULT 'under_treatment',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Tabela de Campanhas de Arrecadação (Campaigns)
-- Valores armazenados em centavos (BIGINT) para precisão monetária estrita.
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category campaign_category NOT NULL,
    category_label TEXT NOT NULL,
    summary TEXT NOT NULL,
    story TEXT NOT NULL,
    target_amount_cents BIGINT NOT NULL CHECK (target_amount_cents > 0),
    raised_amount_cents BIGINT NOT NULL DEFAULT 0 CHECK (raised_amount_cents >= 0),
    supporters_count INTEGER NOT NULL DEFAULT 0 CHECK (supporters_count >= 0),
    urgency campaign_urgency NOT NULL DEFAULT 'medium',
    status campaign_status NOT NULL DEFAULT 'draft',
    image_url TEXT NOT NULL,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Tabela de Atualizações Médicas e Prestação de Contas (Campaign Updates)
CREATE TABLE IF NOT EXISTS campaign_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT NOT NULL,
    receipt_urls TEXT[] NOT NULL DEFAULT '{}',
    photo_urls TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Tabela de Doações (Donations)
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
    donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    net_amount_cents BIGINT CHECK (net_amount_cents >= 0),
    fee_cents BIGINT NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
    status donation_status NOT NULL DEFAULT 'pending',
    payment_method payment_method NOT NULL DEFAULT 'pix',
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    donor_display_name TEXT,
    donor_email TEXT, -- Dado pessoal protegido, nunca exposto a visitantes
    external_reference_id TEXT UNIQUE, -- ID gerado pelo gateway de pagamento (ex: txid Pix)
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Tabela de Eventos de Pagamento / Webhooks (Payment Events)
-- Idempotência estrita: restrição UNIQUE em (gateway, event_id)
CREATE TABLE IF NOT EXISTS payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway TEXT NOT NULL,
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    external_reference_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    status payment_event_status NOT NULL DEFAULT 'received',
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_payment_events_gateway_event UNIQUE (gateway, event_id)
);

-- 10. Índices para Otimização de Consultas Frequentes
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_animals_org ON animals(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_org ON campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaign_updates_campaign ON campaign_updates(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_ext_ref ON donations(external_reference_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_ref ON payment_events(external_reference_id);

-- 11. View Pública Segura para Organizações (Ocultando CPF/CNPJ e Chave PIX)
CREATE OR REPLACE VIEW public_organizations AS
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
