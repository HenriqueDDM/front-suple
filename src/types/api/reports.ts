export interface SalesTrendPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface SalesByCategoryPoint {
  category: string;
  value: number;
}

export interface TopProductReport {
  name: string;
  units: number;
  revenue: number;
}

export interface DashboardStats {
  revenueToday: number;
  ordersToday: number;
  productCount: number;
  customerCount: number;
}

export interface ReportsSummary {
  revenue: number;
  profit: number;
  unitsSold: number;
  activeCustomers: number;
}
