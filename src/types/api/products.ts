import type { Product } from "@/types";

export type CreateProductDto = Omit<Product, "id">;
export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductCatalog {
  categories: string[];
  suppliers: string[];
}

export interface ProductBuyer {
  customerId: string;
  customerName: string;
  phone: string;
  purchaseCount: number;
  totalQuantity: number;
  lastPurchase: string;
  recurrent: boolean;
}

export interface ProductSaleEntry {
  saleId: string;
  code: string;
  customerId: string | null;
  customerName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  paymentMethod: import("@/types").PaymentMethod;
  createdAt: string;
}

export interface ProductProfileStats {
  unitsSold: number;
  saleCount: number;
  uniqueBuyers: number;
  revenue: number;
}

export interface ProductProfile {
  product: Product;
  stats: ProductProfileStats;
  buyers: ProductBuyer[];
  recentSales: ProductSaleEntry[];
}
