export interface PurchaseInstallment {
  number: string;
  dueDate: string;
  amount: number;
}

export interface PurchaseInvoiceItem {
  productId: string | null;
  description: string;
  quantity: number;
  unitCost: number;
  salePrice: number;
  ncm: string;
}

export interface PurchaseInvoice {
  id: string;
  supplierId: string | null;
  supplierName: string;
  number: string | null;
  issueDate: string | null;
  accessKey: string;
  paymentMethod: string;
  installments: PurchaseInstallment[];
  total: number;
  itemCount: number;
  items: PurchaseInvoiceItem[];
  createdAt: string;
}

export interface PurchaseImportPreviewItem {
  description: string;
  quantity: number;
  unitCost: number;
  ncm: string | null;
  suggestedProductId: string | null;
  suggestedProductName: string | null;
  suggestedSalePrice: number;
}

export interface PurchaseImportPreview {
  supplierName: string | null;
  supplierCnpj: string | null;
  accessKey: string | null;
  number: string | null;
  issueDate: string | null;
  paymentMethod: string;
  installments: PurchaseInstallment[];
  items: PurchaseImportPreviewItem[];
  isDuplicate: boolean;
}

export interface ConfirmPurchaseImportItemDto {
  productId?: string | null;
  description: string;
  quantity: number;
  unitCost: number;
  salePrice: number;
  ncm?: string;
  createProductName?: string;
}

export interface ConfirmPurchaseImportDto {
  xml: string;
  accessKey?: string;
  supplierName?: string;
  supplierCnpj?: string;
  number?: string;
  issueDate?: string;
  paymentMethod?: string;
  installments?: PurchaseInstallment[];
  items: ConfirmPurchaseImportItemDto[];
}

export interface SupplierKpis {
  totalPurchased: number;
  purchaseCount: number;
  averageTicket: number;
  lastPurchase: string | null;
}

export interface SupplierProfile {
  supplier: import("@/types").Supplier;
  kpis: SupplierKpis;
  purchases: PurchaseInvoice[];
}
