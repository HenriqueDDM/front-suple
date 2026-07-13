// Domain types — shaped to match a future NestJS backend.

export type * from "./api";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  supplier: string;
  barcode: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  minStock: number;
  imageUrl: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf: string;
  birthDate: string;
  notes: string;
  lastPurchase: string | null;
  totalSpent: number;
}

export type PaymentMethod = "cash" | "credit" | "debit" | "pix";

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  code: string;
  customerId: string | null;
  customerName: string;
  items: SaleItem[];
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export type MovementType = "entry" | "exit" | "adjustment";

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  reason: string;
  createdAt: string;
}

export interface StoreSettings {
  name: string;
  phone: string;
  email: string;
  cnpj: string;
  address: string;
  logoUrl: string;
}
