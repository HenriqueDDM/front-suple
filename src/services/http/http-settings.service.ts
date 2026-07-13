import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { ApiClient } from "@/services/api/client";
import type { ISettingsService } from "@/services/interfaces";
import type { StoreSettings } from "@/types";
import type { UpdateStoreSettingsDto } from "@/types/api";

export class HttpSettingsService implements ISettingsService {
  constructor(private readonly client: ApiClient) {}

  getStoreSettings(): Promise<StoreSettings> {
    return this.client.get<StoreSettings>(API_ENDPOINTS.settings.store);
  }

  updateStoreSettings(dto: UpdateStoreSettingsDto): Promise<StoreSettings> {
    return this.client.patch<StoreSettings>(API_ENDPOINTS.settings.store, dto);
  }
}
