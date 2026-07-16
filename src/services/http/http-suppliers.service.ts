import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { ISuppliersService } from "@/services/interfaces";
import type { Supplier } from "@/types";
import type { CreateSupplierDto, UpdateSupplierDto, SupplierProfile } from "@/types/api";

export class HttpSuppliersService implements ISuppliersService {
  constructor(private readonly client: ApiClient) {}

  findAll(): Promise<Supplier[]> {
    return this.client.get<Supplier[]>(API_ENDPOINTS.suppliers.list);
  }

  async findById(id: string): Promise<Supplier | null> {
    try {
      return await this.client.get<Supplier>(API_ENDPOINTS.suppliers.byId(id));
    } catch {
      return null;
    }
  }

  async getProfile(id: string): Promise<SupplierProfile | null> {
    try {
      return await this.client.get<SupplierProfile>(API_ENDPOINTS.suppliers.profile(id));
    } catch {
      return null;
    }
  }

  create(dto: CreateSupplierDto): Promise<Supplier> {
    return this.client.post<Supplier>(API_ENDPOINTS.suppliers.list, dto);
  }

  update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    return this.client.patch<Supplier>(API_ENDPOINTS.suppliers.byId(id), dto);
  }

  delete(id: string): Promise<void> {
    return this.client.delete<void>(API_ENDPOINTS.suppliers.byId(id));
  }
}
