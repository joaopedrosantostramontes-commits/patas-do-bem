export interface FormatCurrencyOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatCurrency(amount: number, options?: FormatCurrencyOptions): string {
  const minDigits = options?.minimumFractionDigits ?? 2;
  const maxDigits = options?.maximumFractionDigits ?? 2;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(amount);
}

export function calculateProgress(raised: number, target: number): number {
  if (target <= 0) return 0;
  const percentage = Math.round((raised / target) * 100);
  return Math.min(percentage, 100);
}
