import type { Product, Sale } from "@/types";
import type {
  CreateProductDto,
  ProductCatalog,
  ProductProfile,
  UpdateProductDto,
} from "@/types/api";

export interface IProductsService {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  getProfile(id: string): Promise<ProductProfile | null>;
  getSalesHistory(id: string): Promise<Sale[]>;
  create(dto: CreateProductDto): Promise<Product>;
  update(id: string, dto: UpdateProductDto): Promise<Product>;
  delete(id: string): Promise<void>;
  getCatalog(): Promise<ProductCatalog>;
}
