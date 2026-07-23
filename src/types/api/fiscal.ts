export type FiscalEnvironment = "homologacao" | "producao";
export type FiscalProvider = "focus_nfe" | "simulated";
export type InvoiceStatus =
  | "pending"
  | "authorized"
  | "rejected"
  | "cancelled"
  | "simulated";
export type InvoiceType = "nfce" | "nfe";

export interface FiscalSettings {
  enabled: boolean;
  emitOnSale: boolean;
  provider: FiscalProvider;
  environment: FiscalEnvironment;
  hasApiToken: boolean;
  cnpjEmitente: string;
  inscricaoEstadual: string;
  razaoSocial: string;
  nomeFantasia: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  defaultCfop: string;
  defaultCsosn: string;
  defaultNcm: string;
  cscId: string;
  hasCscToken: boolean;
}

export type UpdateFiscalSettingsDto = Partial<
  Omit<FiscalSettings, "hasApiToken" | "hasCscToken" | "provider">
> & {
  apiToken?: string;
  cscToken?: string;
  provider?: FiscalProvider;
};

export interface SaleInvoice {
  id: string;
  saleId: string;
  type: InvoiceType;
  status: InvoiceStatus;
  provider: FiscalProvider;
  externalRef: string;
  accessKey: string;
  number: string;
  series: string;
  protocol: string;
  danfeUrl: string;
  xmlUrl: string;
  qrcodeUrl: string;
  rejectionReason: string;
  amount: number;
  authorizedAt: string | null;
  createdAt: string;
}
