import type { Customer, Sale } from "@/types";
import type {
  CreateCustomerDto,
  CustomerProfile,
  UpdateCustomerDto,
} from "@/types/api";

export interface ICustomersService {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  getProfile(id: string): Promise<CustomerProfile | null>;
  getPurchases(id: string): Promise<Sale[]>;
  create(dto: CreateCustomerDto): Promise<Customer>;
  update(id: string, dto: UpdateCustomerDto): Promise<Customer>;
  delete(id: string): Promise<void>;
}
