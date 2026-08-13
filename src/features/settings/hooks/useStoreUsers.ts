import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersService, queryKeys } from "@/services";
import type { CreateStoreUserDto } from "@/types/api";

const usersService = getUsersService();

export function useStoreUsers() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => usersService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateStoreUserDto) => usersService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createUser: createMutation.mutateAsync,
    removeUser: removeMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}
