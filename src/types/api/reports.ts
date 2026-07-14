export interface ReportPeriod {
  from: string;
  to: string;
}

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
  profit: number;
  marginPercent: number;
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
  marginPercent: number;
  orders: number;
  averageTicket: number;
  unitsSold: number;
  activeCustomers: number;
  from: string;
  to: string;
}
