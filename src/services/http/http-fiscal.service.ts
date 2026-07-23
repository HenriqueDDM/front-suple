import type { ApiClient } from "@/services/api/client";
import type { IFiscalService } from "@/services/interfaces/fiscal.service";
import type {
  FiscalSettings,
  SaleInvoice,
  UpdateFiscalSettingsDto,
} from "@/types/api/fiscal";

export class HttpFiscalService implements IFiscalService {
  constructor(private readonly client: ApiClient) {}

  getSettings(): Promise<FiscalSettings> {
    return this.client.get<FiscalSettings>("/fiscal/settings");
  }

  updateSettings(dto: UpdateFiscalSettingsDto): Promise<FiscalSettings> {
    return this.client.patch<FiscalSettings>("/fiscal/settings", dto);
  }

  emitForSale(saleId: string, consumerCpf?: string): Promise<SaleInvoice> {
    return this.client.post<SaleInvoice>(`/fiscal/sales/${saleId}/emit`, {
      consumerCpf,
    });
  }

  getForSale(saleId: string): Promise<SaleInvoice | null> {
    return this.client.get<SaleInvoice | null>(`/fiscal/sales/${saleId}`);
  }

  refreshInvoice(id: string): Promise<SaleInvoice> {
    return this.client.post<SaleInvoice>(`/fiscal/invoices/${id}/refresh`, {});
  }

  cancelInvoice(id: string, justificativa: string): Promise<SaleInvoice> {
    return this.client.post<SaleInvoice>(`/fiscal/invoices/${id}/cancel`, {
      justificativa,
    });
  }
}
