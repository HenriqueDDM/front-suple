import { stockMovements as seedMovements } from "@/services/mock/data/stock";
import { mockProductsService } from "@/services/mock/mock-products.service";
import type { IStockService } from "@/services/interfaces";
import type { StockMovement } from "@/types";
import type { CreateStockMovementDto } from "@/types/api";
import { movementTypeLabel } from "@/shared/utils/format";

class MockStockService implements IStockService {
  private store: StockMovement[] = [...seedMovements];

  async getMovements(): Promise<StockMovement[]> {
    return [...this.store];
  }

  async createMovement(dto: CreateStockMovementDto): Promise<StockMovement> {
    const product = await mockProductsService.findById(dto.productId);
    if (!product) throw new Error(`Product ${dto.productId} not found`);

    const quantity = dto.type === "exit" ? -Math.abs(dto.quantity) : Math.abs(dto.quantity);

    const movement: StockMovement = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      type: dto.type,
      quantity,
      reason: dto.reason ?? movementTypeLabel[dto.type],
      createdAt: new Date().toISOString(),
    };

    this.store = [movement, ...this.store];
    return movement;
  }
}

export const mockStockService = new MockStockService();
