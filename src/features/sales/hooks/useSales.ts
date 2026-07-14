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
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stock.movements });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.sales });
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.dashboard });
      queryClient.invalidateQueries({ queryKey: ["reports", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["reports", "sales-trend"] });
      queryClient.invalidateQueries({ queryKey: ["reports", "sales-by-category"] });
      queryClient.invalidateQueries({ queryKey: ["reports", "top-products"] });
    },
  });

  return {
    items,
    isLoading,
    error,
    createSale: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
