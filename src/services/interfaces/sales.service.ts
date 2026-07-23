import type { Sale } from "@/types";
import type { CreateSaleDto, PaginatedResult, SalesListQuery } from "@/types/api";

export interface ISalesService {
  findAll(): Promise<Sale[]>;
  findPaginated(query: SalesListQuery): Promise<PaginatedResult<Sale>>;
  findById(id: string): Promise<Sale | null>;
  create(dto: CreateSaleDto): Promise<Sale>;
}
