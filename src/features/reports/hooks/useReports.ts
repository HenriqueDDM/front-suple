import { useQuery } from "@tanstack/react-query";
import { env } from "@/config/env";
import { useAuth } from "@/shared/contexts/AuthContext";
import { getAccessToken } from "@/services/api/auth-store";
import { getReportsService, queryKeys } from "@/services";
import type { ReportPeriod } from "@/types/api";

const reportsService = getReportsService();

export function useReports(
  period?: ReportPeriod,
  options?: { includeSalesList?: boolean },
) {
  const { isLoading: authLoading } = useAuth();
  const from = period?.from;
  const to = period?.to;
  const includeSalesList = options?.includeSalesList ?? true;
  const canFetch =
    typeof window !== "undefined" &&
    !authLoading &&
    (env.useMockApi || Boolean(getAccessToken()));

  const salesQuery = useQuery({
    queryKey: queryKeys.reports.sales,
    queryFn: () => reportsService.getSales(),
    enabled: canFetch && includeSalesList,
  });

  const salesTrendQuery = useQuery({
    queryKey: queryKeys.reports.salesTrend(from, to),
    queryFn: () => reportsService.getSalesTrend(period),
    enabled: canFetch,
  });

  const salesByCategoryQuery = useQuery({
    queryKey: queryKeys.reports.salesByCategory(from, to),
    queryFn: () => reportsService.getSalesByCategory(period),
    enabled: canFetch,
  });

  const topProductsQuery = useQuery({
    queryKey: queryKeys.reports.topProducts(from, to),
    queryFn: () => reportsService.getTopProducts(period),
    enabled: canFetch,
  });

  const dashboardStatsQuery = useQuery({
    queryKey: queryKeys.reports.dashboard,
    queryFn: () => reportsService.getDashboardStats(),
    enabled: canFetch,
  });

  const summaryQuery = useQuery({
    queryKey: queryKeys.reports.summary(from, to),
    queryFn: () => reportsService.getReportsSummary(period),
    enabled: canFetch,
  });

  return {
    sales: salesQuery.data ?? [],
    salesTrend: salesTrendQuery.data ?? [],
    salesByCategory: salesByCategoryQuery.data ?? [],
    topProducts: topProductsQuery.data ?? [],
    dashboardStats: dashboardStatsQuery.data,
    summary: summaryQuery.data,
    isLoading:
      !canFetch ||
      salesTrendQuery.isLoading ||
      salesByCategoryQuery.isLoading ||
      topProductsQuery.isLoading ||
      summaryQuery.isLoading,
    isDashboardLoading: !canFetch || dashboardStatsQuery.isLoading,
    error:
      salesTrendQuery.error ??
      salesByCategoryQuery.error ??
      topProductsQuery.error ??
      summaryQuery.error ??
      null,
  };
}
