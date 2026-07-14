import type { Customer, Sale } from "@/types";

export type CreateCustomerDto = Omit<Customer, "id" | "lastPurchase" | "totalSpent">;
export type UpdateCustomerDto = Partial<CreateCustomerDto>;

export interface CustomerKpis {
  totalSpent: number;
  purchaseCount: number;
  averageTicket: number;
  lastPurchase: string | null;
  averageIntervalDays: number | null;
}

export interface CustomerProductPattern {
  productId: string;
  productName: string;
  purchaseCount: number;
  totalQuantity: number;
  averageIntervalDays: number | null;
  lastPurchase: string;
  nextExpected: string | null;
  daysUntilNext: number | null;
}

export interface CustomerProfile {
  customer: Customer;
  kpis: CustomerKpis;
  purchases: Sale[];
  productPatterns: CustomerProductPattern[];
}
