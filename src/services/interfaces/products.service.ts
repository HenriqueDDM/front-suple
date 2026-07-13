import type { Product } from "@/types";
import type { CreateProductDto, ProductCatalog, UpdateProductDto } from "@/types/api";

export interface IProductsService {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(dto: CreateProductDto): Promise<Product>;
  update(id: string, dto: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<void>;
  getCatalog(): Promise<ProductCatalog>;
}
