import { storeSettings as seedSettings } from "@/services/mock/data/settings";
import type { ISettingsService } from "@/services/interfaces";
import type { StoreSettings } from "@/types";
import type { UpdateStoreSettingsDto } from "@/types/api";

class MockSettingsService implements ISettingsService {
  private store: StoreSettings = { ...seedSettings };

  async getStoreSettings(): Promise<StoreSettings> {
    return { ...this.store };
  }

  async updateStoreSettings(dto: UpdateStoreSettingsDto): Promise<StoreSettings> {
    this.store = { ...this.store, ...dto };
    return { ...this.store };
  }
}

export const mockSettingsService = new MockSettingsService();
