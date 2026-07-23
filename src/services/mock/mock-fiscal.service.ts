import type { IFiscalService } from "@/services/interfaces/fiscal.service";
import type {
  FiscalSettings,
  SaleInvoice,
  UpdateFiscalSettingsDto,
} from "@/types/api/fiscal";

let settings: FiscalSettings = {
  enabled: true,
  emitOnSale: true,
  provider: "simulated",
  environment: "homologacao",
  hasApiToken: false,
  cnpjEmitente: "11111111000111",
  inscricaoEstadual: "123456789",
  razaoSocial: "Tradutto Demo",
  nomeFantasia: "Tradutto",
  logradouro: "Av. Paulista",
  numero: "1000",
  bairro: "Bela Vista",
  municipio: "Sao Paulo",
  uf: "SP",
  cep: "01310100",
  defaultCfop: "5102",
  defaultCsosn: "102",
  defaultNcm: "21069090",
  cscId: "",
  hasCscToken: false,
};

const invoices = new Map<string, SaleInvoice>();

export const mockFiscalService: IFiscalService = {
  async getSettings() {
    return { ...settings };
  },

  async updateSettings(dto: UpdateFiscalSettingsDto) {
    settings = {
      ...settings,
      ...dto,
      hasApiToken: dto.apiToken !== undefined ? Boolean(dto.apiToken) : settings.hasApiToken,
      hasCscToken: dto.cscToken !== undefined ? Boolean(dto.cscToken) : settings.hasCscToken,
      provider: dto.apiToken ? "focus_nfe" : settings.provider,
    };
    if (dto.apiToken === "") settings.provider = "simulated";
    return { ...settings };
  },

  async emitForSale(saleId: string) {
    const invoice: SaleInvoice = {
      id: `inv-${saleId}`,
      saleId,
      type: "nfce",
      status: "simulated",
      provider: "simulated",
      externalRef: `sale-${saleId.slice(0, 8)}`,
      accessKey: "65" + "0".repeat(42),
      number: "1001",
      series: "1",
      protocol: "SIM-1001",
      danfeUrl: "",
      xmlUrl: "",
      qrcodeUrl: "",
      rejectionReason: "",
      amount: 0,
      authorizedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    invoices.set(saleId, invoice);
    return invoice;
  },

  async getForSale(saleId: string) {
    return invoices.get(saleId) ?? null;
  },

  async refreshInvoice(id: string) {
    for (const invoice of invoices.values()) {
      if (invoice.id === id) return invoice;
    }
    throw new Error("Invoice not found");
  },

  async cancelInvoice(id: string, justificativa: string) {
    for (const [saleId, invoice] of invoices.entries()) {
      if (invoice.id === id) {
        const updated = {
          ...invoice,
          status: "cancelled" as const,
          rejectionReason: justificativa,
        };
        invoices.set(saleId, updated);
        return updated;
      }
    }
    throw new Error("Invoice not found");
  },
};
