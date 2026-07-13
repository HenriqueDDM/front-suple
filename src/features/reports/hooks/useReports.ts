import { useQuery } from "@tanstack/react-query";
import { getReportsService, queryKeys } from "@/services";

const reportsService = getReportsService();

export function useReports() {
  const salesQuery = useQuery({
    queryKey: queryKeys.reports.sales,
    queryFn: () => reportsService.getSales(),
  });

  const salesTrendQuery = useQuery({
    queryKey: queryKeys.reports.salesTrend,
    queryFn: () => reportsService.getSalesTrend(),
  });

  const salesByCategoryQuery = useQuery({
    queryKey: queryKeys.reports.salesByCategory,
    queryFn: () => reportsService.getSalesByCategory(),
  });

  const topProductsQuery = useQuery({
    queryKey: queryKeys.reports.topProducts,
    queryFn: () => reportsService.getTopProducts(),
  });

  const dashboardStatsQuery = useQuery({
    queryKey: queryKeys.reports.dashboard,
    queryFn: () => reportsService.getDashboardStats(),
  });

  const summaryQuery = useQuery({
    queryKey: queryKeys.reports.summary,
    queryFn: () => reportsService.getReportsSummary(),
  });

  return {
    sales: salesQuery.data ?? [],
    salesTrend: salesTrendQuery.data ?? [],
    salesByCategory: salesByCategoryQuery.data ?? [],
    topProducts: topProductsQuery.data ?? [],
    dashboardStats: dashboardStatsQuery.data,
    summary: summaryQuery.data,
    isLoading:
      salesQuery.isLoading ||
      salesTrendQuery.isLoading ||
      salesByCategoryQuery.isLoading ||
      topProductsQuery.isLoading ||
      dashboardStatsQuery.isLoading ||
      summaryQuery.isLoading,
  };
}
