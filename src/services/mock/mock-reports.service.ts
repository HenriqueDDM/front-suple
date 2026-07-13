import {
  sales as seedSales,
  salesByCategory,
  salesTrend,
  topProducts,
} from "@/services/mock/data/sales";
import { products as seedProducts } from "@/services/mock/data/products";
import { customers as seedCustomers } from "@/services/mock/data/customers";
import type { IReportsService } from "@/services/interfaces";
import type {
  DashboardStats,
  ReportsSummary,
  SalesByCategoryPoint,
  SalesTrendPoint,
  TopProductReport,
} from "@/types/api";
import type { Sale } from "@/types";

class MockReportsService implements IReportsService {
  async getSales(): Promise<Sale[]> {
    return [...seedSales];
  }

  async getSalesTrend(): Promise<SalesTrendPoint[]> {
    return [...salesTrend];
  }

  async getSalesByCategory(): Promise<SalesByCategoryPoint[]> {
    return [...salesByCategory];
  }

  async getTopProducts(): Promise<TopProductReport[]> {
    return [...topProducts];
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const latest = salesTrend[salesTrend.length - 1];
    return {
      revenueToday: latest.revenue,
      ordersToday: latest.orders,
      productCount: seedProducts.length,
      customerCount: seedCustomers.length,
    };
  }

  async getReportsSummary(): Promise<ReportsSummary> {
    const revenue = salesTrend.reduce((sum, day) => sum + day.revenue, 0);
    const unitsSold = topProducts.reduce((sum, product) => sum + product.units, 0);

    return {
      revenue,
      profit: revenue * 0.38,
      unitsSold,
      activeCustomers: 128,
    };
  }
}

export const mockReportsService = new MockReportsService();
