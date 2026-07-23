import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlatformService, queryKeys } from "@/services";
import type { CreatePlatformStoreDto, UpdatePlatformStoreDto } from "@/types/api";

const platformService = getPlatformService();

export function usePlatformSummary() {
  return useQuery({
    queryKey: queryKeys.platform.summary,
    queryFn: () => platformService.getSummary(),
  });
}

export function usePlatformStores() {
  return useQuery({
    queryKey: queryKeys.platform.stores,
    queryFn: () => platformService.listStores(),
  });
}

export function usePlatformStore(id: string) {
  return useQuery({
    queryKey: queryKeys.platform.store(id),
    queryFn: () => platformService.getStore(id),
    enabled: Boolean(id),
  });
}

export function usePlatformStoreUsers(id: string) {
  return useQuery({
    queryKey: queryKeys.platform.storeUsers(id),
    queryFn: () => platformService.listStoreUsers(id),
    enabled: Boolean(id),
  });
}

export function usePlatformStoreMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["platform"] });
  };

  const createStore = useMutation({
    mutationFn: (dto: CreatePlatformStoreDto) => platformService.createStore(dto),
    onSuccess: invalidate,
  });

  const updateStore = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePlatformStoreDto }) =>
      platformService.updateStore(id, dto),
    onSuccess: invalidate,
  });

  return { createStore, updateStore };
}
