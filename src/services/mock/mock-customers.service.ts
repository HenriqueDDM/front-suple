import { customers as seedCustomers } from "@/services/mock/data/customers";
import type { ICustomersService } from "@/services/interfaces";
import type { Customer } from "@/types";
import type { CreateCustomerDto, UpdateCustomerDto } from "@/types/api";

class MockCustomersService implements ICustomersService {
  private store: Customer[] = [...seedCustomers];

  async findAll(): Promise<Customer[]> {
    return [...this.store];
  }

  async findById(id: string): Promise<Customer | null> {
    return this.store.find((customer) => customer.id === id) ?? null;
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer: Customer = {
      ...dto,
      id: crypto.randomUUID(),
      lastPurchase: null,
      totalSpent: 0,
    };
    this.store = [customer, ...this.store];
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const index = this.store.findIndex((customer) => customer.id === id);
    if (index === -1) throw new Error(`Customer ${id} not found`);

    const updated = { ...this.store[index], ...dto };
    this.store = this.store.map((customer) => (customer.id === id ? updated : customer));
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.store = this.store.filter((customer) => customer.id !== id);
  }
}

export const mockCustomersService = new MockCustomersService();
