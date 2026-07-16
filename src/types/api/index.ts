export type {
  CreateProductDto,
  UpdateProductDto,
  ProductCatalog,
  ProductBuyer,
  ProductSaleEntry,
  ProductPriceHistoryEntry,
  UpdateProductPriceDto,
  ProductProfileStats,
  ProductProfile,
} from "./products";
export type { CreateSupplierDto, UpdateSupplierDto, SupplierProfile } from "./suppliers";
export type {
  PurchaseInvoice,
  PurchaseImportPreview,
  ConfirmPurchaseImportDto,
  SupplierKpis,
} from "./purchases";
export type {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerKpis,
  CustomerProductPattern,
  CustomerProfile,
} from "./customers";
export type { CreateSaleDto, CreateSaleItemDto, SaleResponse } from "./sales";
export type { CreateStockMovementDto } from "./stock";
export type { UpdateStoreSettingsDto } from "./settings";
export type {
  SalesTrendPoint,
  SalesByCategoryPoint,
  TopProductReport,
  DashboardStats,
  ReportsSummary,
  ReportPeriod,
} from "./reports";
