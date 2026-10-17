import test from "node:test";
import assert from "node:assert/strict";

// Funções de lógica de segurança simuladas para espelhar as regras de validação da migration 004
interface SimulatedDonation {
  id: string;
  campaign_id: string;
  amount_cents: number;
  status: "pending" | "processing" | "paid" | "failed" | "refunded" | "cancelled";
  donor_email: string;
  external_reference_id: string;
  donor_display_name: string;
  is_anonymous: boolean;
}

interface SimulatedCampaign {
  id: string;
  target_amount_cents: number;
  raised_amount_cents: number;
  supporters_count: number;
  status: "draft" | "pending_approval" | "active" | "paused" | "completed" | "cancelled";
}

interface SimulatedOrganization {
  id: string;
  name: string;
  document: string; // CPF ou CNPJ
  pix_key: string;
  bank_account_info: Record<string, unknown>;
  status: "pending_approval" | "approved" | "suspended" | "rejected";
}

// Simulador da regra do Webhook Idempotente e Validação de Eventos
function simulatePaymentWebhookProcess(
  event: {
    event_type: string;
    amount_cents: number;
    currency?: string;
  },
  donation: SimulatedDonation,
  campaign: SimulatedCampaign
) {
  if (event.currency && event.currency !== "BRL") {
    throw new Error("Moeda não suportada");
  }

  if (event.amount_cents <= 0) {
    throw new Error("Valor inválido");
  }

  const normalized = event.event_type.trim().toUpperCase();

  if (normalized === "PAYMENT_CONFIRMED" || normalized === "PAYMENT_RECEIVED") {
    if (donation.status === "paid") {
      return { success: true, is_duplicate: true };
    }
    if (event.amount_cents < donation.amount_cents) {
      return { success: false, is_duplicate: false, error: "divergent_amount" };
    }
    donation.status = "paid";
    campaign.raised_amount_cents += donation.amount_cents;
    campaign.supporters_count += 1;
    return { success: true, is_duplicate: false, action: "payment_confirmed" };
  }

  if (normalized === "PAYMENT_REFUNDED" || normalized === "PAYMENT_CHARGEBACK") {
    if (donation.status === "paid") {
      donation.status = "refunded";
      campaign.raised_amount_cents = Math.max(0, campaign.raised_amount_cents - donation.amount_cents);
      campaign.supporters_count = Math.max(0, campaign.supporters_count - 1);
      return { success: true, is_duplicate: false, action: "refund_processed" };
    }
    donation.status = "refunded";
    return { success: true, is_duplicate: false, action: "refund_recorded_no_decrement" };
  }

  if (normalized === "PAYMENT_FAILED" || normalized === "PAYMENT_CANCELLED") {
    if (donation.status === "pending") {
      donation.status = normalized === "PAYMENT_FAILED" ? "failed" : "cancelled";
    }
    return { success: true, is_duplicate: false, action: "failure_recorded" };
  }

  return { success: true, is_duplicate: false, action: "ignored_informational" };
}

// Simulador da View Pública de Organizações (Sanitização)
function sanitizeOrganizationForPublic(org: SimulatedOrganization) {
  if (org.status !== "approved") return null;
  return {
    id: org.id,
    name: org.name,
    status: org.status,
  };
}

// Simulador da View Pública de Doações (Sanitização)
function sanitizeDonationForPublic(donation: SimulatedDonation) {
  if (donation.status !== "paid" || donation.is_anonymous) return null;
  return {
    id: donation.id,
    campaign_id: donation.campaign_id,
    amount_cents: donation.amount_cents,
    donor_display_name: donation.donor_display_name,
  };
}

// TESTES

test("Segurança de Webhook: rejeita pagamento se valor recebido for menor que o valor da doação", () => {
  const donation: SimulatedDonation = {
    id: "don-1",
    campaign_id: "camp-1",
    amount_cents: 5000, // R$ 50,00 esperado
    status: "pending",
    donor_email: "test@example.com",
    external_reference_id: "tx-1",
    donor_display_name: "Apoiador Teste",
    is_anonymous: false,
  };
  const campaign: SimulatedCampaign = {
    id: "camp-1",
    target_amount_cents: 100000,
    raised_amount_cents: 10000,
    supporters_count: 2,
    status: "active",
  };

  // Tentativa de confirmação de pagamento com valor inferior (R$ 10,00)
  const result = simulatePaymentWebhookProcess(
    { event_type: "PAYMENT_CONFIRMED", amount_cents: 1000, currency: "BRL" },
    donation,
    campaign
  );

  assert.equal(result.success, false);
  assert.equal(result.error, "divergent_amount");
  assert.equal(donation.status, "pending");
  assert.equal(campaign.raised_amount_cents, 10000); // Não foi incrementado!
  assert.equal(campaign.supporters_count, 2);
});

test("Segurança de Webhook: eventos neutros ou de falha não incrementam arrecadação da campanha", () => {
  const donation: SimulatedDonation = {
    id: "don-2",
    campaign_id: "camp-2",
    amount_cents: 3000,
    status: "pending",
    donor_email: "test2@example.com",
    external_reference_id: "tx-2",
    donor_display_name: "Doador 2",
    is_anonymous: false,
  };
  const campaign: SimulatedCampaign = {
    id: "camp-2",
    target_amount_cents: 50000,
    raised_amount_cents: 0,
    supporters_count: 0,
    status: "active",
  };

  // Evento de falha de pagamento
  const resultFail = simulatePaymentWebhookProcess(
    { event_type: "PAYMENT_FAILED", amount_cents: 3000, currency: "BRL" },
    donation,
    campaign
  );
  assert.equal(resultFail.success, true);
  assert.equal(resultFail.action, "failure_recorded");
  assert.equal(donation.status, "failed");
  assert.equal(campaign.raised_amount_cents, 0); // Permanece zero

  // Evento genérico ou informativo
  const resultCreated = simulatePaymentWebhookProcess(
    { event_type: "PAYMENT_CREATED", amount_cents: 3000, currency: "BRL" },
    donation,
    campaign
  );
  assert.equal(resultCreated.action, "ignored_informational");
  assert.equal(campaign.raised_amount_cents, 0);
});

test("Segurança de Webhook: evento de estorno (PAYMENT_REFUNDED) decrementa arrecadação de doação previamente paga", () => {
  const donation: SimulatedDonation = {
    id: "don-3",
    campaign_id: "camp-3",
    amount_cents: 10000, // R$ 100,00
    status: "paid",
    donor_email: "test3@example.com",
    external_reference_id: "tx-3",
    donor_display_name: "Doador 3",
    is_anonymous: false,
  };
  const campaign: SimulatedCampaign = {
    id: "camp-3",
    target_amount_cents: 100000,
    raised_amount_cents: 25000,
    supporters_count: 3,
    status: "active",
  };

  const refundResult = simulatePaymentWebhookProcess(
    { event_type: "PAYMENT_REFUNDED", amount_cents: 10000, currency: "BRL" },
    donation,
    campaign
  );

  assert.equal(refundResult.success, true);
  assert.equal(refundResult.action, "refund_processed");
  assert.equal(donation.status, "refunded");
  assert.equal(campaign.raised_amount_cents, 15000); // R$ 250 - R$ 100 = R$ 150
  assert.equal(campaign.supporters_count, 2); // 3 - 1 = 2
});

test("Privacidade: view pública de organizações não expõe CPF, CNPJ ou chaves bancárias", () => {
  const rawOrg: SimulatedOrganization = {
    id: "org-123",
    name: "SOS Patinhas",
    document: "12.345.678/0001-99", // Sensível
    pix_key: "chave-pix-secreta@sos.org", // Sensível
    bank_account_info: { banco: "001", agencia: "1234", conta: "56789-0" }, // Sensível
    status: "approved",
  };

  const sanitized = sanitizeOrganizationForPublic(rawOrg);
  assert.ok(sanitized);
  assert.equal((sanitized as unknown as Record<string, unknown>).document, undefined);
  assert.equal((sanitized as unknown as Record<string, unknown>).pix_key, undefined);
  assert.equal((sanitized as unknown as Record<string, unknown>).bank_account_info, undefined);
  assert.equal(sanitized?.name, "SOS Patinhas");
});

test("Privacidade: view pública de doações não expõe email nem transações anônimas", () => {
  const regularDonation: SimulatedDonation = {
    id: "d-1",
    campaign_id: "c-1",
    amount_cents: 5000,
    status: "paid",
    donor_email: "privado@exemplo.com", // Sensível
    external_reference_id: "gateway-tx-sec-999", // Sensível
    donor_display_name: "Mariana Silva",
    is_anonymous: false,
  };

  const anonymousDonation: SimulatedDonation = {
    id: "d-2",
    campaign_id: "c-1",
    amount_cents: 10000,
    status: "paid",
    donor_email: "anonimo@exemplo.com",
    external_reference_id: "gateway-tx-sec-888",
    donor_display_name: "Anônimo",
    is_anonymous: true,
  };

  const pubReg = sanitizeDonationForPublic(regularDonation);
  assert.ok(pubReg);
  assert.equal((pubReg as unknown as Record<string, unknown>).donor_email, undefined);
  assert.equal((pubReg as unknown as Record<string, unknown>).external_reference_id, undefined);
  assert.equal(pubReg?.donor_display_name, "Mariana Silva");

  const pubAnon = sanitizeDonationForPublic(anonymousDonation);
  assert.equal(pubAnon, null); // Doações anônimas não aparecem na listagem nominal pública
});
