import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { ISalesService } from "@/services/interfaces";
import type { Sale } from "@/types";
import type { CreateSaleDto, PaginatedResult, SalesListQuery } from "@/types/api";

export class HttpSalesService implements ISalesService {
  constructor(private readonly client: ApiClient) {}

  findAll(): Promise<Sale[]> {
    return this.client.get<Sale[]>(API_ENDPOINTS.sales.list);
  }

  findPaginated(query: SalesListQuery): Promise<PaginatedResult<Sale>> {
    return this.client.get<PaginatedResult<Sale>>(API_ENDPOINTS.sales.list, {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
      },
    });
  }

  findById(id: string): Promise<Sale | null> {
    return this.client.get<Sale>(API_ENDPOINTS.sales.byId(id));
  }

  create(dto: CreateSaleDto): Promise<Sale> {
    return this.client.post<Sale>(API_ENDPOINTS.sales.list, dto);
  }
}
