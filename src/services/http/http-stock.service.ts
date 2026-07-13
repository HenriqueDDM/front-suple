import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { IStockService } from "@/services/interfaces";
import type { StockMovement } from "@/types";
import type { CreateStockMovementDto } from "@/types/api";

export class HttpStockService implements IStockService {
  constructor(private readonly client: ApiClient) {}

  getMovements(): Promise<StockMovement[]> {
    return this.client.get<StockMovement[]>(API_ENDPOINTS.stock.movements);
  }

  createMovement(dto: CreateStockMovementDto): Promise<StockMovement> {
    return this.client.post<StockMovement>(API_ENDPOINTS.stock.movements, dto);
  }
}
