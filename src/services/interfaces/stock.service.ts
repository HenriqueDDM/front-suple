import type { StockMovement } from "@/types";
import type { CreateStockMovementDto } from "@/types/api";

export interface IStockService {
  getMovements(): Promise<StockMovement[]>;
  createMovement(dto: CreateStockMovementDto): Promise<StockMovement>;
}
