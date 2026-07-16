import { suppliers as seedSuppliers } from "@/services/mock/data/suppliers";
import type { ISuppliersService } from "@/services/interfaces";
import type { Supplier } from "@/types";
import type { CreateSupplierDto, UpdateSupplierDto, SupplierProfile } from "@/types/api";

class MockSuppliersService implements ISuppliersService {
  private store: Supplier[] = [...seedSuppliers];

  async findAll(): Promise<Supplier[]> {
    return [...this.store];
  }

  async findById(id: string): Promise<Supplier | null> {
    return this.store.find((supplier) => supplier.id === id) ?? null;
  }

  async getProfile(id: string): Promise<SupplierProfile | null> {
    const supplier = await this.findById(id);
    if (!supplier) return null;

    const { mockPurchasesService } = await import("./mock-purchases.service");
    const purchases = await mockPurchasesService.findBySupplier(id);
    const totalPurchased = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const purchaseCount = purchases.length;

    return {
      supplier,
      kpis: {
        totalPurchased,
        purchaseCount,
        averageTicket: purchaseCount > 0 ? totalPurchased / purchaseCount : 0,
        lastPurchase: purchases[0]?.createdAt ?? null,
      },
      purchases,
    };
  }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const supplier: Supplier = { ...dto, id: crypto.randomUUID() };
    this.store = [supplier, ...this.store];
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    const index = this.store.findIndex((supplier) => supplier.id === id);
    if (index === -1) throw new Error(`Supplier ${id} not found`);
    const updated = { ...this.store[index], ...dto };
    this.store = this.store.map((supplier) => (supplier.id === id ? updated : supplier));
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.store = this.store.filter((supplier) => supplier.id !== id);
  }
}

export const mockSuppliersService = new MockSuppliersService();
