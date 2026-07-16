import type { Supplier } from "@/types";
import type { CreateSupplierDto, UpdateSupplierDto, SupplierProfile } from "@/types/api";

export interface ISuppliersService {
  findAll(): Promise<Supplier[]>;
  findById(id: string): Promise<Supplier | null>;
  getProfile(id: string): Promise<SupplierProfile | null>;
  create(dto: CreateSupplierDto): Promise<Supplier>;
  update(id: string, dto: UpdateSupplierDto): Promise<Supplier>;
  delete(id: string): Promise<void>;
}
