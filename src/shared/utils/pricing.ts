export type PricingMode = "manual" | "markup" | "margin";

export function calculateSaleFromCost(
  purchasePrice: number,
  mode: PricingMode,
  pricingValue: number,
): number | null {
  if (mode === "manual" || purchasePrice < 0) return null;
  if (mode === "markup") {
    return Math.round(purchasePrice * (1 + pricingValue / 100) * 100) / 100;
  }
  if (pricingValue >= 100) return null;
  return Math.round((purchasePrice / (1 - pricingValue / 100)) * 100) / 100;
}

export function pricingModeLabel(mode: PricingMode): string {
  switch (mode) {
    case "markup":
      return "Markup";
    case "margin":
      return "Margem";
    default:
      return "Manual";
  }
}
