import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettingsService, queryKeys } from "@/services";
import type { UpdateStoreSettingsDto } from "@/types/api";

const settingsService = getSettingsService();

export function useSettings() {
  const queryClient = useQueryClient();

  const {
    data: storeSettings,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.settings.store,
    queryFn: () => settingsService.getStoreSettings(),
  });

  const updateMutation = useMutation({
    mutationFn: (dto: UpdateStoreSettingsDto) => settingsService.updateStoreSettings(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.store });
    },
  });

  return {
    storeSettings,
    isLoading,
    error,
    updateStoreSettings: updateMutation.mutateAsync,
  };
}
