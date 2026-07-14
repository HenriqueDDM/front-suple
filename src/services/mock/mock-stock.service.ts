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

    let signedQuantity: number;
    let newQuantity: number;

    switch (dto.type) {
      case "entry":
        if (dto.quantity < 1) throw new Error("Quantidade inválida");
        signedQuantity = Math.abs(dto.quantity);
        newQuantity = product.quantity + signedQuantity;
        break;
      case "exit":
        if (dto.quantity < 1) throw new Error("Quantidade inválida");
        signedQuantity = -Math.abs(dto.quantity);
        newQuantity = product.quantity + signedQuantity;
        break;
      case "adjustment":
        newQuantity = Math.abs(dto.quantity);
        signedQuantity = newQuantity - product.quantity;
        break;
      default:
        throw new Error("Tipo de movimentação inválido");
    }

    if (newQuantity < 0) {
      throw new Error("Estoque insuficiente");
    }

    await mockProductsService.update(product.id, { quantity: newQuantity });

    const movement: StockMovement = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      type: dto.type,
      quantity: signedQuantity,
      reason: dto.reason ?? movementTypeLabel[dto.type],
      createdAt: new Date().toISOString(),
    };

    this.store = [movement, ...this.store];
    return movement;
  }
}

export const mockStockService = new MockStockService();
