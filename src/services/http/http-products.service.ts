import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { IProductsService } from "@/services/interfaces";
import type { Product } from "@/types";
import type { CreateProductDto, ProductCatalog, UpdateProductDto } from "@/types/api";

export class HttpProductsService implements IProductsService {
  constructor(private readonly client: ApiClient) {}

  findAll(): Promise<Product[]> {
    return this.client.get<Product[]>(API_ENDPOINTS.products.list);
  }

  async findById(id: string): Promise<Product | null> {
    try {
      return await this.client.get<Product>(API_ENDPOINTS.products.byId(id));
    } catch {
      return null;
    }
  }

  create(dto: CreateProductDto): Promise<Product> {
    return this.client.post<Product>(API_ENDPOINTS.products.list, dto);
  }

  update(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.client.patch<Product>(API_ENDPOINTS.products.byId(id), dto);
  }

  delete(id: string): Promise<void> {
    return this.client.delete<void>(API_ENDPOINTS.products.byId(id));
  }

  async getCatalog(): Promise<ProductCatalog> {
    const [categories, suppliers] = await Promise.all([
      this.client.get<string[]>(API_ENDPOINTS.products.categories),
      this.client.get<string[]>(API_ENDPOINTS.products.suppliers),
    ]);
    return { categories, suppliers };
  }
}
