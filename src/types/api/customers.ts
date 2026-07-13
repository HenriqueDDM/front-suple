import type { Customer } from "@/types";

export type CreateCustomerDto = Omit<Customer, "id" | "lastPurchase" | "totalSpent">;
export type UpdateCustomerDto = Partial<CreateCustomerDto>;
