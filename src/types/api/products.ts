import type { Product } from "@/types";

export type CreateProductDto = Omit<Product, "id">;
export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductCatalog {
  categories: string[];
  suppliers: string[];
}
