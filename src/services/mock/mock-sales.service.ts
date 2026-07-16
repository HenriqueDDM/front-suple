import { sales as seedSales } from "@/services/mock/data/sales";
import { mockCustomersService } from "@/services/mock/mock-customers.service";
import { mockProductsService } from "@/services/mock/mock-products.service";
import type { ISalesService } from "@/services/interfaces";
import type { Sale } from "@/types";
import type { CreateSaleDto } from "@/types/api";

class MockSalesService implements ISalesService {
  private store: Sale[] = [...seedSales];
  private codeCounter = seedSales.length + 42;

  async findAll(): Promise<Sale[]> {
    return [...this.store];
  }

  async findById(id: string): Promise<Sale | null> {
    return this.store.find((sale) => sale.id === id) ?? null;
  }

  async create(dto: CreateSaleDto): Promise<Sale> {
    const items = await Promise.all(
      dto.items.map(async (item) => {
        const product = await mockProductsService.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (item.quantity > product.quantity) {
          throw new Error(`Estoque insuficiente de ${product.name}`);
        }

        return {
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: item.isGift ? 0 : product.salePrice,
          isGift: item.isGift ?? false,
        };
      }),
    );

    for (const item of items) {
      const product = await mockProductsService.findById(item.productId);
      if (!product) continue;
      await mockProductsService.update(item.productId, {
        quantity: product.quantity - item.quantity,
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const total = Math.max(0, subtotal - dto.discount);

    let customerName = "Consumidor final";
    if (dto.customerId) {
      const customer = await mockCustomersService.findById(dto.customerId);
      customerName = customer?.name ?? "Cliente";
    }

    const sale: Sale = {
      id: crypto.randomUUID(),
      code: `#${this.codeCounter++}`,
      customerId: dto.customerId,
      customerName,
      items,
      discount: dto.discount,
      total,
      paymentMethod: dto.paymentMethod,
      createdAt: new Date().toISOString(),
      notes: dto.notes ?? "",
    };

    this.store = [sale, ...this.store];
    return sale;
  }
}

export const mockSalesService = new MockSalesService();
