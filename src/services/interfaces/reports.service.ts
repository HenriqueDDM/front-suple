import type {
  DashboardStats,
  ReportPeriod,
  ReportsSummary,
  SalesByCategoryPoint,
  SalesTrendPoint,
  TopProductReport,
} from "@/types/api";
import type { Sale } from "@/types";

export interface IReportsService {
  getSales(): Promise<Sale[]>;
  getSalesTrend(period?: ReportPeriod): Promise<SalesTrendPoint[]>;
  getSalesByCategory(period?: ReportPeriod): Promise<SalesByCategoryPoint[]>;
  getTopProducts(period?: ReportPeriod): Promise<TopProductReport[]>;
  getDashboardStats(): Promise<DashboardStats>;
  getReportsSummary(period?: ReportPeriod): Promise<ReportsSummary>;
}
