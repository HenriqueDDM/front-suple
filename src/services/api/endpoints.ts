export const API_ENDPOINTS = {
  products: {
    list: "/products",
    byId: (id: string) => `/products/${id}`,
    sales: (id: string) => `/products/${id}/sales`,
    profile: (id: string) => `/products/${id}/profile`,
    categories: "/products/categories",
    suppliers: "/products/suppliers",
  },
  customers: {
    list: "/customers",
    byId: (id: string) => `/customers/${id}`,
    purchases: (id: string) => `/customers/${id}/purchases`,
    profile: (id: string) => `/customers/${id}/profile`,
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
