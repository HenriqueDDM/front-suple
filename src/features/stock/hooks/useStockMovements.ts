import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStockService, queryKeys } from "@/services";
import type { CreateStockMovementDto } from "@/types/api";

const stockService = getStockService();

export function useStockMovements() {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.stock.movements,
    queryFn: () => stockService.getMovements(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateStockMovementDto) => stockService.createMovement(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.movements });
    },
  });

  return {
    items,
    isLoading,
    error,
    createMovement: createMutation.mutate,
  };
}
