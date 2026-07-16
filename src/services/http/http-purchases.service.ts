import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { IPurchasesService } from "@/services/interfaces/purchases.service";
import type {
  ConfirmPurchaseImportDto,
  PurchaseImportPreview,
  PurchaseInvoice,
} from "@/types/api/purchases";

export class HttpPurchasesService implements IPurchasesService {
  constructor(private readonly client: ApiClient) {}

  previewImport(xml: string, fileName?: string): Promise<PurchaseImportPreview> {
    return this.client.post<PurchaseImportPreview>(API_ENDPOINTS.purchases.preview, {
      xml,
      fileName,
    });
  }

  confirmImport(dto: ConfirmPurchaseImportDto): Promise<PurchaseInvoice> {
    return this.client.post<PurchaseInvoice>(API_ENDPOINTS.purchases.confirm, dto);
  }

  findAll(): Promise<PurchaseInvoice[]> {
    return this.client.get<PurchaseInvoice[]>(API_ENDPOINTS.purchases.list);
  }

  findById(id: string): Promise<PurchaseInvoice | null> {
    return this.client.get<PurchaseInvoice>(API_ENDPOINTS.purchases.byId(id));
  }

  async getXml(id: string): Promise<string | null> {
    try {
      return await this.client.getText(API_ENDPOINTS.purchases.xml(id));
    } catch {
      return null;
    }
  }
}
