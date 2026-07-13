import { products as seedProducts, categories, suppliers } from "@/services/mock/data/products";
import type { IProductsService } from "@/services/interfaces";
import type { Product } from "@/types";
import type { CreateProductDto, ProductCatalog, UpdateProductDto } from "@/types/api";

class MockProductsService implements IProductsService {
  private store: Product[] = [...seedProducts];

  async findAll(): Promise<Product[]> {
    return [...this.store];
  }

  async findById(id: string): Promise<Product | null> {
    return this.store.find((product) => product.id === id) ?? null;
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
