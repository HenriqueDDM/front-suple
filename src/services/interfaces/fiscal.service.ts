import type {
  FiscalSettings,
  SaleInvoice,
  UpdateFiscalSettingsDto,
} from "@/types/api/fiscal";

export interface IFiscalService {
  getSettings(): Promise<FiscalSettings>;
  updateSettings(dto: UpdateFiscalSettingsDto): Promise<FiscalSettings>;
  emitForSale(saleId: string, consumerCpf?: string): Promise<SaleInvoice>;
  getForSale(saleId: string): Promise<SaleInvoice | null>;
  refreshInvoice(id: string): Promise<SaleInvoice>;
  cancelInvoice(id: string, justificativa: string): Promise<SaleInvoice>;
}
