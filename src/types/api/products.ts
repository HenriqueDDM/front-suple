import type { PricingMode, Product } from "@/types";

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

export interface ProductPriceHistoryEntry {
  id: string;
  productId: string;
  oldPurchasePrice: number;
  newPurchasePrice: number;
  oldSalePrice: number;
  newSalePrice: number;
  changedByUserId: string | null;
  note: string;
  createdAt: string;
}

export interface UpdateProductPriceDto {
  purchasePrice?: number;
  salePrice?: number;
  pricingMode?: PricingMode;
  pricingValue?: number;
  note?: string;
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
  priceHistory: ProductPriceHistoryEntry[];
}
