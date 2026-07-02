import type { PaymentMethod, MovementType, StockStatus } from "@/types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatDate(value: string | Date | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}

export function formatDateTime(value: string | Date | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function stockStatus(quantity: number, minStock: number): StockStatus {
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= minStock) return "low_stock";
  return "in_stock";
}

export const stockStatusLabel: Record<StockStatus, string> = {
  in_stock: "Em estoque",
  low_stock: "Estoque baixo",
  out_of_stock: "Esgotado",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  cash: "Dinheiro",
  credit: "Crédito",
  debit: "Débito",
  pix: "Pix",
};

export const movementTypeLabel: Record<MovementType, string> = {
  entry: "Entrada",
  exit: "Saída",
  adjustment: "Ajuste",
};
