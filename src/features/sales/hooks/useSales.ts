import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSalesService, queryKeys } from "@/services";
import type { CreateSaleDto } from "@/types/api";

const salesService = getSalesService();

export function useSales() {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.sales.all,
    queryFn: () => salesService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateSaleDto) => salesService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.sales });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.summary });
    },
  });

  return {
    items,
    isLoading,
    error,
    createSale: createMutation.mutateAsync,
  };
}
