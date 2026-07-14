import { products as seedProducts, categories, suppliers } from "@/services/mock/data/products";
import type { IProductsService } from "@/services/interfaces";
import type { Product, Sale } from "@/types";
import type {
  CreateProductDto,
  ProductCatalog,
  ProductProfile,
  UpdateProductDto,
} from "@/types/api";

class MockProductsService implements IProductsService {
  private store: Product[] = [...seedProducts];

  async findAll(): Promise<Product[]> {
    return [...this.store];
  }

  async findById(id: string): Promise<Product | null> {
    return this.store.find((product) => product.id === id) ?? null;
  }

  async getSalesHistory(id: string): Promise<Sale[]> {
    const { mockSalesService } = await import("@/services/mock/mock-sales.service");
    const sales = await mockSalesService.findAll();
    return sales.filter((sale) => sale.items.some((item) => item.productId === id));
  }

  async getProfile(id: string): Promise<ProductProfile | null> {
    const product = await this.findById(id);
    if (!product) return null;

    const sales = await this.getSalesHistory(id);
    const { mockCustomersService } = await import("@/services/mock/mock-customers.service");

    const recentSales = sales.flatMap((sale) =>
      sale.items
        .filter((item) => item.productId === id)
        .map((item) => ({
          saleId: sale.id,
          code: sale.code,
          customerId: sale.customerId,
          customerName: sale.customerName || "Consumidor final",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.quantity * item.unitPrice,
          paymentMethod: sale.paymentMethod,
          createdAt: sale.createdAt,
        })),
    );

    type Agg = {
      customerName: string;
      saleIds: Set<string>;
      totalQuantity: number;
      lastPurchase: string;
    };
    const byCustomer = new Map<string, Agg>();
    for (const sale of sales) {
      if (!sale.customerId) continue;
      for (const item of sale.items) {
        if (item.productId !== id) continue;
        const current = byCustomer.get(sale.customerId) ?? {
          customerName: sale.customerName || "Cliente",
          saleIds: new Set<string>(),
          totalQuantity: 0,
          lastPurchase: sale.createdAt,
        };
        current.saleIds.add(sale.id);
        current.totalQuantity += item.quantity;
        if (new Date(sale.createdAt) > new Date(current.lastPurchase)) {
          current.lastPurchase = sale.createdAt;
        }
        byCustomer.set(sale.customerId, current);
      }
    }

    const buyers = await Promise.all(
      [...byCustomer.entries()].map(async ([customerId, agg]) => {
        const customer = await mockCustomersService.findById(customerId);
        return {
          customerId,
          customerName: agg.customerName,
          phone: customer?.phone ?? "",
          purchaseCount: agg.saleIds.size,
          totalQuantity: agg.totalQuantity,
          lastPurchase: agg.lastPurchase,
          recurrent: agg.saleIds.size >= 2,
        };
      }),
    );

    buyers.sort(
      (a, b) =>
        b.purchaseCount - a.purchaseCount ||
        b.lastPurchase.localeCompare(a.lastPurchase),
    );

    return {
      product,
      stats: {
        unitsSold: recentSales.reduce((sum, row) => sum + row.quantity, 0),
        saleCount: recentSales.length,
        uniqueBuyers: buyers.length,
        revenue: recentSales.reduce((sum, row) => sum + row.lineTotal, 0),
      },
      buyers,
      recentSales,
    };
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product: Product = { ...dto, id: crypto.randomUUID() };
    this.store = [product, ...this.store];
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const index = this.store.findIndex((product) => product.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);

    const updated = { ...this.store[index], ...dto };
    this.store = this.store.map((product) => (product.id === id ? updated : product));
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.store = this.store.filter((product) => product.id !== id);
  }

  async getCatalog(): Promise<ProductCatalog> {
    return { categories: [...categories], suppliers: [...suppliers] };
  }
}

export const mockProductsService = new MockProductsService();
