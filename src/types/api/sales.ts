import type { PaymentMethod, Sale } from "@/types";

export interface CreateSaleItemDto {
  productId: string;
  quantity: number;
  isGift?: boolean;
}

export interface CreateSaleDto {
  customerId: string | null;
  items: CreateSaleItemDto[];
  discount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export type SaleResponse = Sale;
