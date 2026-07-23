import type { ApiClient } from "@/services/api/client";
import type { IPlatformService } from "@/services/interfaces/platform.service";
import type {
  CreatePlatformStoreDto,
  PlatformStore,
  PlatformStoreUser,
  PlatformSummary,
  UpdatePlatformStoreDto,
} from "@/types/api/platform";

export class HttpPlatformService implements IPlatformService {
  constructor(private readonly client: ApiClient) {}

  getSummary(): Promise<PlatformSummary> {
    return this.client.get<PlatformSummary>("/platform/summary");
  }

  listStores(): Promise<PlatformStore[]> {
    return this.client.get<PlatformStore[]>("/platform/stores");
  }

  getStore(id: string): Promise<PlatformStore> {
    return this.client.get<PlatformStore>(`/platform/stores/${id}`);
  }

  listStoreUsers(id: string): Promise<PlatformStoreUser[]> {
    return this.client.get<PlatformStoreUser[]>(`/platform/stores/${id}/users`);
  }

  createStore(dto: CreatePlatformStoreDto): Promise<PlatformStore> {
    return this.client.post<PlatformStore>("/platform/stores", dto);
  }

  updateStore(id: string, dto: UpdatePlatformStoreDto): Promise<PlatformStore> {
    return this.client.patch<PlatformStore>(`/platform/stores/${id}`, dto);
  }
}
