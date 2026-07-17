import type { StoreSettings } from "@/types";

export type UpdateStoreSettingsDto = Partial<Omit<StoreSettings, "plan">>;
