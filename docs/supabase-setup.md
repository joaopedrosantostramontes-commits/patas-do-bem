# Guia de Configuração e Aplicação de Migrações — Supabase (Patas do Bem)

Este documento descreve como configurar o ambiente de dados, executar as migrações SQL versionadas e validar as políticas de segurança (Row Level Security - RLS) da plataforma **Patas do Bem**.

---

## 1. Visão Geral da Arquitetura de Dados

O banco de dados relacional (PostgreSQL via Supabase) foi estruturado com foco em **integridade financeira**, **privilégio mínimo** e **idempotência de eventos**:

1. **`profiles`**: Perfis de usuários vinculados ao `auth.users(id)` com papéis (`donor`, `rescuer`, `admin`).
2. **`organizations`**: Protetores independentes e ONGs. Documentos (CPF/CNPJ) e chaves bancárias/PIX são sensíveis e nunca expostos publicamente.
3. **`animals`**: Animais sob cuidados, associados a uma organização responsável.
4. **`campaigns`**: Campanhas com metas e arrecadações expressas em centavos (`bigint`) para precisão monetária estrita.
5. **`campaign_updates`**: Diário médico com notas fiscais e fotos públicas de prestação de contas.
6. **`donations`**: Doações associadas a campanhas, com controle de status (`pending`, `paid`, `refunded`).
7. **`payment_events`**: Ledger idempotente de webhooks recebidos do gateway, com restrição única `(gateway, event_id)`.

---

## 2. Opções de Ambiente para o Supabase

### Opção A: Supabase Cloud (Recomendado para Testes Remotos)
1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Crie um novo projeto chamado `patas-do-bem`.
3. Acesse o **SQL Editor** no painel do Supabase.
4. Execute os arquivos de migração em ordem:
   - `supabase/migrations/20261016000001_initial_schema.sql`
   - `supabase/migrations/20261016000002_rls_policies.sql`
   - `supabase/migrations/20261016000003_triggers_and_idempotency.sql`
   - `supabase/migrations/20261016000004_security_hardening.sql`
5. Acesse **Project Settings > API** e copie:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` -> `SUPABASE_SERVICE_ROLE_KEY` (apenas para ambiente de servidor/webhooks).
6. Crie o arquivo `.env.local` na raiz do projeto Next.js com as variáveis acima.

---

### Opção B: Supabase Local (via Supabase CLI e Docker)
*Pré-requisitos: Docker Desktop e Supabase CLI instalados no computador.*

1. Instale a CLI do Supabase (quando disponível):
   ```bash
   npm install -g supabase
   ```
2. Inicie os containers locais:
   ```bash
   npx supabase start
   ```
3. Aplique as migrações locais:
   ```bash
   npx supabase migration up
   # ou
   npx supabase db reset
   ```
4. As credenciais locais serão exibidas no terminal para inclusão no `.env.local`.

---

## 3. Segurança e Mecanismos de Proteção Implementados

### Privilégio Mínimo e Proteção contra Fraudes
- **Campanhas e Valores:** Usuários comuns (incluindo o protetor que cadastrou a campanha) **não possuem permissão** para alterar os campos `raised_amount_cents` ou `supporters_count`. Esses campos são atualizados exclusivamente por funções transacionais do banco.
- **Imutabilidade de Beneficiário:** Uma campanha aprovada não pode ter seu `organization_id` transferido por usuários comuns.
- **Status de Campanha:** A ativação de campanhas (`status = 'active'`) depende de aprovação administrativa. O protetor só pode submeter para `pending_approval`.
- **Status Financeiro de Doações:** Nenhuma requisição do navegador pode alterar uma doação para `paid`. Somente o `service_role` através da função transacional de webhooks pode confirmar o pagamento.

### Blindagem de Funções `SECURITY DEFINER`
As funções `is_admin()`, `handle_updated_at()` e `process_payment_webhook_idempotent()` foram criadas com as seguintes proteções:
1. `SET search_path = public, pg_temp;` explícito em todas as declarações, prevenindo ataques de sequestro de caminho de busca (search_path hijacking).
2. `REVOKE EXECUTE ON FUNCTION ... FROM PUBLIC, anon, authenticated;`
3. Permissão restrita via `GRANT EXECUTE ... TO service_role` na função de processamento de webhooks.

### Idempotência Transacional e Tratamento de Concorrência
A função `process_payment_webhook_idempotent` trata duplicidade e concorrência:
1. Tenta inserir na tabela `payment_events` com `ON CONFLICT (gateway, event_id) DO NOTHING`.
2. Se o evento já tiver sido registrado e processado, retorna imediatamente com `{ is_duplicate: true }` sem reexecutar incrementos.
3. Utiliza bloqueio exclusivo de linha (`FOR UPDATE`) nas tabelas `donations` e `payment_events` para impedir condições de corrida em disparos simultâneos de webhooks.
4. Atualiza a doação para `status = 'paid'` e incrementa a arrecadação da campanha **na mesmíssima transação** (`UPDATE campaigns SET raised_amount_cents = raised_amount_cents + donation.amount_cents`). Se qualquer instrução falhar, toda a operação sofre rollback atômico.

### Proteção de Dados Sensíveis e Visões Sanitizadas
- **Organizações:** Acesso direto à tabela `organizations` foi revogado para `anon`. A view `public_organizations` foi configurada com `security_invoker = false`, expondo somente organizações aprovadas e campos não confidenciais (CPF, CNPJ, dados bancários e chave PIX ficam inacessíveis a visitantes).
- **Doações:** Leitura direta de `donations` revogada para `anon`. A view pública `public_donations` expõe estritamente o identificador, campanha, valor em centavos, nome de exibição e data de confirmação para doações pagas não anônimas. `donor_email` e `external_reference_id` não são expostos.

### Autenticidade de Webhook (Pendência de Homologação)
> [!IMPORTANT]
> A função de banco `process_payment_webhook_idempotent` é executada estritamente com `service_role` e garante integridade referencial, moeda, valor e idempotência. No entanto, a **validação da assinatura criptográfica do webhook** (ex: HMAC-SHA256 ou token Bearer no cabeçalho HTTP) deve ser implementada na Route Handler do Next.js (backend) assim que o gateway definitivo for selecionado.

---

## 4. Como Testar as Políticas RLS e Funções (Cenários de Teste)

Ao conectar um banco local ou no Supabase Cloud, você pode executar os seguintes testes no SQL Editor:

### Cenário 1: Visitante Anônimo (`anon`)
```sql
-- Definir contexto como visitante anônimo
SET ROLE anon;

-- 1. Leitura de campanhas ativas permitida:
SELECT id, title, status FROM campaigns;

-- 2. TENTATIVA DE CONSULTA DIRETA A ORGANIZAÇÕES:
SELECT document, pix_key, bank_account_info FROM organizations;
-- Resultado Esperado: ERRO de permissão negada (acesso revogado para anon).

-- 3. Leitura correta e sanitizada via view pública:
SELECT id, name, city, state FROM public_organizations;
-- Resultado: Sucesso (apenas dados públicos de ONGs aprovadas).

-- 4. TENTATIVA DE CONSULTA A E-MAILS DE DOADORES:
SELECT donor_email, external_reference_id FROM donations;
-- Resultado Esperado: ERRO de permissão negada (acesso revogado para anon).

-- 5. Leitura pública de apoiadores via view pública:
SELECT campaign_id, amount_cents, donor_display_name FROM public_donations;
-- Resultado: Sucesso (sem e-mails e sem doações anônimas).
```

### Cenário 2: Protetor Autenticado (`authenticated`)
```sql
-- Definir contexto com o UID do protetor
SET request.jwt.claim.sub = 'uuid-do-protetor';
SET ROLE authenticated;

-- TENTATIVA DE FRAUDE: Alterar meta de campanha já ativa sem nova aprovação
UPDATE campaigns SET target_amount_cents = 9999999 WHERE id = 'uuid-campanha-ativa';
-- Resultado Esperado: ERRO de permissão negada pela política campaigns_update_owner_or_admin.

-- TENTATIVA DE FRAUDE: Criar doação para campanha em rascunho ou inativa
INSERT INTO donations (campaign_id, amount_cents, status) VALUES ('uuid-campanha-draft', 5000, 'pending');
-- Resultado Esperado: ERRO de violação de RLS (campanhas não ativas bloqueadas).
```

### Cenário 3: Webhook com `service_role` (Idempotência e Reembolso)
```sql
-- Definir contexto como service_role
SET ROLE service_role;

-- 1. Confirmação legítima de pagamento
SELECT process_payment_webhook_idempotent(
    'asaas',
    'evt_teste_123',
    'PAYMENT_CONFIRMED',
    'ext_ref_doacao_001',
    5000,
    99,
    '{"id": "evt_teste_123"}'::jsonb,
    'BRL'
);
-- Retorno: {"success": true, "action": "payment_confirmed", "is_duplicate": false}

-- 2. Repetição do mesmo webhook (Idempotência):
SELECT process_payment_webhook_idempotent(
    'asaas',
    'evt_teste_123',
    'PAYMENT_CONFIRMED',
    'ext_ref_doacao_001',
    5000,
    99,
    '{"id": "evt_teste_123"}'::jsonb,
    'BRL'
);
-- Retorno: {"success": true, "is_duplicate": true, "message": "Evento repetido já processado..."}

-- 3. Notificação de Estorno (Reembolso):
SELECT process_payment_webhook_idempotent(
    'asaas',
    'evt_teste_refund_456',
    'PAYMENT_REFUNDED',
    'ext_ref_doacao_001',
    5000,
    0,
    '{"id": "evt_teste_refund_456"}'::jsonb,
    'BRL'
);
-- Retorno: {"success": true, "action": "refund_processed", "message": "Reembolso processado..."}
-- Verificação: O saldo da campanha e o total de apoiadores são decrementados atomicamente.
```
