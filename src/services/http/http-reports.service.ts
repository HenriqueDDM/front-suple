import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { IReportsService } from "@/services/interfaces";
import type {
  DashboardStats,
  ReportsSummary,
  SalesByCategoryPoint,
  SalesTrendPoint,
  TopProductReport,
} from "@/types/api";
import type { Sale } from "@/types";

export class HttpReportsService implements IReportsService {
  constructor(private readonly client: ApiClient) {}

  getSales(): Promise<Sale[]> {
    return this.client.get<Sale[]>(API_ENDPOINTS.sales.list);
  }

  getSalesTrend(): Promise<SalesTrendPoint[]> {
    return this.client.get<SalesTrendPoint[]>(API_ENDPOINTS.reports.salesTrend);
  }

  getSalesByCategory(): Promise<SalesByCategoryPoint[]> {
    return this.client.get<SalesByCategoryPoint[]>(API_ENDPOINTS.reports.salesByCategory);
  }

  getTopProducts(): Promise<TopProductReport[]> {
    return this.client.get<TopProductReport[]>(API_ENDPOINTS.reports.topProducts);
  }

  getDashboardStats(): Promise<DashboardStats> {
    return this.client.get<DashboardStats>(API_ENDPOINTS.reports.dashboard);
  }

  getReportsSummary(): Promise<ReportsSummary> {
    return this.client.get<ReportsSummary>(API_ENDPOINTS.reports.summary);
  }
}
