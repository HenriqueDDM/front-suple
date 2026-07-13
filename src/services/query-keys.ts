export const queryKeys = {
  products: {
    all: ["products"] as const,
    catalog: ["products", "catalog"] as const,
    detail: (id: string) => ["products", id] as const,
  },
  customers: {
    all: ["customers"] as const,
    detail: (id: string) => ["customers", id] as const,
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
    salesTrend: ["reports", "sales-trend"] as const,
    salesByCategory: ["reports", "sales-by-category"] as const,
    topProducts: ["reports", "top-products"] as const,
    dashboard: ["reports", "dashboard"] as const,
    summary: ["reports", "summary"] as const,
  },
  settings: {
    store: ["settings", "store"] as const,
  },
} as const;
