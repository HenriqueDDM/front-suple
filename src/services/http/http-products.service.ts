import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { IProductsService } from "@/services/interfaces";
import type { Product, Sale } from "@/types";
import type {
  CreateProductDto,
  ProductCatalog,
  ProductProfile,
  UpdateProductDto,
  UpdateProductPriceDto,
} from "@/types/api";

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

  getProfile(id: string): Promise<ProductProfile | null> {
    return this.client.get<ProductProfile>(API_ENDPOINTS.products.profile(id));
  }

  getSalesHistory(id: string): Promise<Sale[]> {
    return this.client.get<Sale[]>(API_ENDPOINTS.products.sales(id));
  }

  create(dto: CreateProductDto): Promise<Product> {
    return this.client.post<Product>(API_ENDPOINTS.products.list, dto);
  }

  update(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.client.patch<Product>(API_ENDPOINTS.products.byId(id), dto);
  }

  updatePrice(id: string, dto: UpdateProductPriceDto): Promise<Product> {
    return this.client.patch<Product>(API_ENDPOINTS.products.price(id), dto);
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
