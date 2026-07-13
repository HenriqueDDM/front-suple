export const API_ENDPOINTS = {
  products: {
    list: "/products",
    byId: (id: string) => `/products/${id}`,
    categories: "/products/categories",
    suppliers: "/products/suppliers",
  },
  customers: {
    list: "/customers",
    byId: (id: string) => `/customers/${id}`,
  },
  sales: {
    list: "/sales",
    byId: (id: string) => `/sales/${id}`,
  },
  stock: {
    movements: "/stock/movements",
    levels: "/stock/levels",
  },
  reports: {
    salesTrend: "/reports/sales-trend",
    salesByCategory: "/reports/sales-by-category",
    topProducts: "/reports/top-products",
    dashboard: "/reports/dashboard",
    summary: "/reports/summary",
  },
  settings: {
    store: "/settings/store",
  },
} as const;
