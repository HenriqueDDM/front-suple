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
  ReportPeriod,
  ReportsSummary,
  SalesByCategoryPoint,
  SalesTrendPoint,
  TopProductReport,
} from "@/types/api";
import type { Sale } from "@/types";

function toDateKey(value: string): string {
  return value.slice(0, 10);
}

function resolvePeriod(period?: ReportPeriod): { from: string; to: string } {
  if (period?.from && period?.to) {
    return { from: period.from, to: period.to };
  }

  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 29);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

function eachDay(from: string, to: string): string[] {
  const days: string[] = [];
  const cursor = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  while (cursor <= end) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function salesInPeriod(period: { from: string; to: string }): Sale[] {
  return seedSales.filter((sale) => {
    const key = toDateKey(sale.createdAt);
    return key >= period.from && key <= period.to;
  });
}

class MockReportsService implements IReportsService {
  async getSales(): Promise<Sale[]> {
    return [...seedSales];
  }

  async getSalesTrend(period?: ReportPeriod): Promise<SalesTrendPoint[]> {
    const range = resolvePeriod(period);
    const byDay = new Map(salesTrend.map((point) => [point.date, point]));
    const filtered = salesInPeriod(range);

    return eachDay(range.from, range.to).map((date) => {
      const fromSeed = byDay.get(date);
      if (fromSeed) return { ...fromSeed };

      const daySales = filtered.filter((sale) => toDateKey(sale.createdAt) === date);
      const day = new Date(`${date}T12:00:00`);
      return {
        date,
        label: day.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
        revenue: daySales.reduce((sum, sale) => sum + sale.total, 0),
        orders: daySales.length,
      };
    });
  }

  async getSalesByCategory(period?: ReportPeriod): Promise<SalesByCategoryPoint[]> {
    const range = resolvePeriod(period);
    const filtered = salesInPeriod(range);
    if (filtered.length === 0) return [...salesByCategory];

    const productById = new Map(seedProducts.map((product) => [product.id, product]));
    const totals = new Map<string, number>();

    for (const sale of filtered) {
      for (const item of sale.items) {
        const category = productById.get(item.productId)?.category ?? "Outros";
        totals.set(category, (totals.get(category) ?? 0) + item.quantity * item.unitPrice);
      }
    }

    return [...totals.entries()]
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);
  }

  async getTopProducts(period?: ReportPeriod): Promise<TopProductReport[]> {
    const range = resolvePeriod(period);
    const filtered = salesInPeriod(range);
    const productById = new Map(seedProducts.map((product) => [product.id, product]));
    const agg = new Map<string, { units: number; revenue: number; profit: number }>();

    for (const sale of filtered) {
      for (const item of sale.items) {
        const product = productById.get(item.productId);
        const purchasePrice = product?.purchasePrice ?? item.unitPrice * 0.6;
        const current = agg.get(item.productName) ?? { units: 0, revenue: 0, profit: 0 };
        current.units += item.quantity;
        current.revenue += item.quantity * item.unitPrice;
        current.profit += item.quantity * (item.unitPrice - purchasePrice);
        agg.set(item.productName, current);
      }
    }

    const computed = [...agg.entries()]
      .map(([name, data]) => ({
        name,
        units: data.units,
        revenue: data.revenue,
        profit: data.profit,
        marginPercent: data.revenue > 0 ? Math.round((data.profit / data.revenue) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    if (computed.length > 0) return computed;

    return topProducts.map((product) => ({
      ...product,
      profit: product.revenue * 0.38,
      marginPercent: 38,
    }));
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

  async getReportsSummary(period?: ReportPeriod): Promise<ReportsSummary> {
    const range = resolvePeriod(period);
    const filtered = salesInPeriod(range);
    const revenue = filtered.reduce((sum, sale) => sum + sale.total, 0);
    const unitsSold = filtered.reduce(
      (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    );
    const profit = revenue * 0.38;
    const orders = filtered.length;
    const activeCustomers = new Set(
      filtered.map((sale) => sale.customerId).filter((id): id is string => Boolean(id)),
    ).size;

    return {
      revenue,
      profit,
      marginPercent: revenue > 0 ? Math.round((profit / revenue) * 1000) / 10 : 0,
      orders,
      averageTicket: orders > 0 ? revenue / orders : 0,
      unitsSold,
      activeCustomers,
      from: range.from,
      to: range.to,
    };
  }
}

export const mockReportsService = new MockReportsService();
