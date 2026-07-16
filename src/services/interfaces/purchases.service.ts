import type {
  ConfirmPurchaseImportDto,
  PurchaseImportPreview,
  PurchaseInvoice,
} from "@/types/api/purchases";

export interface IPurchasesService {
  previewImport(xml: string, fileName?: string): Promise<PurchaseImportPreview>;
  confirmImport(dto: ConfirmPurchaseImportDto): Promise<PurchaseInvoice>;
  findAll(): Promise<PurchaseInvoice[]>;
  findById(id: string): Promise<PurchaseInvoice | null>;
  getXml(id: string): Promise<string | null>;
}
