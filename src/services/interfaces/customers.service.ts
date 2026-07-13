import type { Customer } from "@/types";
import type { CreateCustomerDto, UpdateCustomerDto } from "@/types/api";

export interface ICustomersService {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  create(dto: CreateCustomerDto): Promise<Customer>;
  update(id: string, dto: UpdateCustomerDto): Promise<Customer>;
  delete(id: string): Promise<void>;
}
