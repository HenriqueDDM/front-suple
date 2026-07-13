import type { Sale } from "@/types";
import type { CreateSaleDto } from "@/types/api";

export interface ISalesService {
  findAll(): Promise<Sale[]>;
  findById(id: string): Promise<Sale | null>;
  create(dto: CreateSaleDto): Promise<Sale>;
}
