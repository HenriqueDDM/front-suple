import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { ICustomersService } from "@/services/interfaces";
import type { Customer, Sale } from "@/types";
import type {
  CreateCustomerDto,
  CustomerProfile,
  UpdateCustomerDto,
} from "@/types/api";

export class HttpCustomersService implements ICustomersService {
  constructor(private readonly client: ApiClient) {}

  findAll(): Promise<Customer[]> {
    return this.client.get<Customer[]>(API_ENDPOINTS.customers.list);
  }

  findById(id: string): Promise<Customer | null> {
    return this.client.get<Customer>(API_ENDPOINTS.customers.byId(id));
  }

  getProfile(id: string): Promise<CustomerProfile | null> {
    return this.client.get<CustomerProfile>(API_ENDPOINTS.customers.profile(id));
  }

  getPurchases(id: string): Promise<Sale[]> {
    return this.client.get<Sale[]>(API_ENDPOINTS.customers.purchases(id));
  }

  create(dto: CreateCustomerDto): Promise<Customer> {
    return this.client.post<Customer>(API_ENDPOINTS.customers.list, dto);
  }

  update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    return this.client.patch<Customer>(API_ENDPOINTS.customers.byId(id), dto);
  }

  delete(id: string): Promise<void> {
    return this.client.delete<void>(API_ENDPOINTS.customers.byId(id));
  }
}
