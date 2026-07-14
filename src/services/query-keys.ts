export const queryKeys = {
  products: {
    all: ["products"] as const,
    catalog: ["products", "catalog"] as const,
    detail: (id: string) => ["products", id] as const,
    sales: (id: string) => ["products", id, "sales"] as const,
    profile: (id: string) => ["products", id, "profile"] as const,
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
} as const;
