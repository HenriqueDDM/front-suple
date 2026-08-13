import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { IUsersService } from "@/services/interfaces/users.service";
import type { CreateStoreUserDto, StoreUser } from "@/types/api/users";

export class HttpUsersService implements IUsersService {
  constructor(private readonly client: ApiClient) {}

  findAll(): Promise<StoreUser[]> {
    return this.client.get<StoreUser[]>(API_ENDPOINTS.users.list);
  }

  create(dto: CreateStoreUserDto): Promise<StoreUser> {
    return this.client.post<StoreUser>(API_ENDPOINTS.users.list, dto);
  }

  remove(id: string): Promise<void> {
    return this.client.delete(API_ENDPOINTS.users.byId(id));
  }
}
