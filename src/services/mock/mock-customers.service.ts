import { customers as seedCustomers } from "@/services/mock/data/customers";
import type { ICustomersService } from "@/services/interfaces";
import type { Customer, Sale } from "@/types";
import type {
  CreateCustomerDto,
  CustomerProfile,
  UpdateCustomerDto,
} from "@/types/api";

class MockCustomersService implements ICustomersService {
  private store: Customer[] = [...seedCustomers];

  async findAll(): Promise<Customer[]> {
    return [...this.store];
  }

  async findById(id: string): Promise<Customer | null> {
    return this.store.find((customer) => customer.id === id) ?? null;
  }

  async getPurchases(id: string): Promise<Sale[]> {
    const { mockSalesService } = await import("@/services/mock/mock-sales.service");
    const sales = await mockSalesService.findAll();
    return sales.filter((sale) => sale.customerId === id);
  }

  async getProfile(id: string): Promise<CustomerProfile | null> {
    const customer = await this.findById(id);
    if (!customer) return null;

    const purchases = await this.getPurchases(id);
    const purchaseCount = purchases.length;
    const totalSpent = purchases.reduce((sum, sale) => sum + sale.total, 0);
    const averageTicket = purchaseCount > 0 ? totalSpent / purchaseCount : 0;

    const sorted = [...purchases].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    let averageIntervalDays: number | null = null;
    if (sorted.length >= 2) {
      let totalDays = 0;
      for (let i = 1; i < sorted.length; i++) {
        totalDays +=
          (new Date(sorted[i].createdAt).getTime() -
            new Date(sorted[i - 1].createdAt).getTime()) /
          86400000;
      }
      averageIntervalDays = Math.round(totalDays / (sorted.length - 1));
    }

    const productMap = new Map<
      string,
      { productName: string; totalQuantity: number; saleIds: Set<string>; dates: Date[] }
    >();

    for (const sale of purchases) {
      const saleDate = new Date(sale.createdAt);
      for (const item of sale.items) {
        const current = productMap.get(item.productId) ?? {
          productName: item.productName,
          totalQuantity: 0,
          saleIds: new Set<string>(),
          dates: [],
        };
        current.totalQuantity += item.quantity;
        if (!current.saleIds.has(sale.id)) {
          current.saleIds.add(sale.id);
          current.dates.push(saleDate);
        }
        productMap.set(item.productId, current);
      }
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const productPatterns = [...productMap.entries()]
      .map(([productId, agg]) => {
        const lastPurchaseDate = agg.dates.reduce((latest, date) =>
          date > latest ? date : latest,
        );
        let interval: number | null = null;
        if (agg.dates.length >= 2) {
          const dates = [...agg.dates].sort((a, b) => a.getTime() - b.getTime());
          let total = 0;
          for (let i = 1; i < dates.length; i++) {
            total += (dates[i].getTime() - dates[i - 1].getTime()) / 86400000;
          }
          interval = Math.round(total / (dates.length - 1));
        }
        const nextExpectedDate =
          interval != null
            ? new Date(lastPurchaseDate.getTime() + interval * 86400000)
            : null;
        let daysUntilNext: number | null = null;
        if (nextExpectedDate) {
          const next = new Date(nextExpectedDate);
          next.setHours(0, 0, 0, 0);
          daysUntilNext = Math.round((next.getTime() - now.getTime()) / 86400000);
        }

        return {
          productId,
          productName: agg.productName,
          purchaseCount: agg.saleIds.size,
          totalQuantity: agg.totalQuantity,
          averageIntervalDays: interval,
          lastPurchase: lastPurchaseDate.toISOString(),
          nextExpected: nextExpectedDate?.toISOString() ?? null,
          daysUntilNext,
        };
      })
      .sort(
        (a, b) =>
          b.purchaseCount - a.purchaseCount || b.totalQuantity - a.totalQuantity,
      );

    return {
      customer,
      kpis: {
        totalSpent,
        purchaseCount,
        averageTicket,
        lastPurchase: sorted.at(-1)?.createdAt ?? null,
        averageIntervalDays,
      },
      purchases: purchases.slice(0, 50),
      productPatterns,
    };
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer: Customer = {
      ...dto,
      id: crypto.randomUUID(),
      lastPurchase: null,
      totalSpent: 0,
    };
    this.store = [customer, ...this.store];
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const index = this.store.findIndex((customer) => customer.id === id);
    if (index === -1) throw new Error(`Customer ${id} not found`);

    const updated = { ...this.store[index], ...dto };
    this.store = this.store.map((customer) => (customer.id === id ? updated : customer));
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.store = this.store.filter((customer) => customer.id !== id);
  }
}

export const mockCustomersService = new MockCustomersService();
