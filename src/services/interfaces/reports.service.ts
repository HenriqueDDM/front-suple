import type {
  DashboardStats,
  ReportsSummary,
  SalesByCategoryPoint,
  SalesTrendPoint,
  TopProductReport,
} from "@/types/api";
import type { Sale } from "@/types";

export interface IReportsService {
  getSales(): Promise<Sale[]>;
  getSalesTrend(): Promise<SalesTrendPoint[]>;
  getSalesByCategory(): Promise<SalesByCategoryPoint[]>;
  getTopProducts(): Promise<TopProductReport[]>;
  getDashboardStats(): Promise<DashboardStats>;
  getReportsSummary(): Promise<ReportsSummary>;
}
