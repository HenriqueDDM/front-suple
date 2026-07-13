import type { StoreSettings } from "@/types";
import type { UpdateStoreSettingsDto } from "@/types/api";

export interface ISettingsService {
  getStoreSettings(): Promise<StoreSettings>;
  updateStoreSettings(dto: UpdateStoreSettingsDto): Promise<StoreSettings>;
}
