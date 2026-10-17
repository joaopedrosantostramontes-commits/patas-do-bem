/**
 * Mapeamento oficial dos links de checkout da Sunize para o Projeto Patas do Bem.
 * Cada valor fixo possui uma URL pública de checkout dedicada.
 */

export const SUNIZE_CHECKOUT_LINKS = {
  10: "https://pay.sunize.com.br/MufVaQNw",
  15: "https://pay.sunize.com.br/AuRhHnlv",
  20: "https://pay.sunize.com.br/hJPAUZxB",
  25: "https://pay.sunize.com.br/XcMJbIbn",
  30: "https://pay.sunize.com.br/tKfbPoXJ",
  50: "https://pay.sunize.com.br/OagBIjIM",
} as const;

export type AllowedDonationAmount = keyof typeof SUNIZE_CHECKOUT_LINKS;

/**
 * Lista exclusiva dos seis valores de doação permitidos na plataforma.
 */
export const ALLOWED_DONATION_AMOUNTS: readonly AllowedDonationAmount[] = [
  10, 15, 20, 25, 30, 50,
] as const;

/**
 * Validador que garante que apenas os valores homologados sejam aceitos.
 */
export function isAllowedDonationAmount(amount: number): amount is AllowedDonationAmount {
  return Object.prototype.hasOwnProperty.call(SUNIZE_CHECKOUT_LINKS, amount);
}

/**
 * Retorna a URL de checkout correspondente da Sunize para o valor selecionado.
 * Retorna null para qualquer valor não autorizado.
 */
export function getSunizeCheckoutUrl(amount: number): string | null {
  if (isAllowedDonationAmount(amount)) {
    return SUNIZE_CHECKOUT_LINKS[amount];
  }
  return null;
}
