export const queryKeys = {
  products: {
    all: ["products"] as const,
    catalog: ["products", "catalog"] as const,
    detail: (id: string) => ["products", id] as const,
    sales: (id: string) => ["products", id, "sales"] as const,
    profile: (id: string) => ["products", id, "profile"] as const,
  },
  suppliers: {
    all: ["suppliers"] as const,
    detail: (id: string) => ["suppliers", id] as const,
    profile: (id: string) => ["suppliers", id, "profile"] as const,
  },
  customers: {
    all: ["customers"] as const,
    detail: (id: string) => ["customers", id] as const,
    purchases: (id: string) => ["customers", id, "purchases"] as const,
    profile: (id: string) => ["customers", id, "profile"] as const,
  },
  sales: {
    all: ["sales"] as const,
    detail: (id: string) => ["sales", id] as const,
  },
  stock: {
    movements: ["stock", "movements"] as const,
  },
  purchases: {
    all: ["purchases"] as const,
    detail: (id: string) => ["purchases", id] as const,
  },
  reports: {
    sales: ["reports", "sales"] as const,
    salesTrend: (from?: string, to?: string) => ["reports", "sales-trend", from ?? "", to ?? ""] as const,
    salesByCategory: (from?: string, to?: string) =>
      ["reports", "sales-by-category", from ?? "", to ?? ""] as const,
    topProducts: (from?: string, to?: string) =>
      ["reports", "top-products", from ?? "", to ?? ""] as const,
    dashboard: ["reports", "dashboard"] as const,
    summary: (from?: string, to?: string) => ["reports", "summary", from ?? "", to ?? ""] as const,
  },
  settings: {
    store: ["settings", "store"] as const,
  },
  fiscal: {
    settings: ["fiscal", "settings"] as const,
    sale: (saleId: string) => ["fiscal", "sale", saleId] as const,
  },
  platform: {
    summary: ["platform", "summary"] as const,
    stores: ["platform", "stores"] as const,
    store: (id: string) => ["platform", "stores", id] as const,
    storeUsers: (id: string) => ["platform", "stores", id, "users"] as const,
  },
} as const;
