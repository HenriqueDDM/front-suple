import type { Supplier } from "@/types";

export type CreateSupplierDto = Omit<Supplier, "id">;
export type UpdateSupplierDto = Partial<CreateSupplierDto>;
