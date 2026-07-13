import type { PaymentMethod, Sale } from "@/types";

export interface CreateSaleItemDto {
  productId: string;
  quantity: number;
}

export interface CreateSaleDto {
  customerId: string | null;
  items: CreateSaleItemDto[];
  discount: number;
  paymentMethod: PaymentMethod;
}

export type SaleResponse = Sale;
