import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSuppliersService, queryKeys } from "@/services";
import type { CreateSupplierDto, UpdateSupplierDto } from "@/types/api";

const suppliersService = getSuppliersService();

export function useSuppliers() {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.suppliers.all,
    queryFn: () => suppliersService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateSupplierDto) => suppliersService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.catalog });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSupplierDto }) =>
      suppliersService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.catalog });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => suppliersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.catalog });
    },
  });

  return {
    items,
    isLoading,
    error,
    createSupplier: createMutation.mutate,
    updateSupplier: (id: string, dto: UpdateSupplierDto) =>
      updateMutation.mutate({ id, dto }),
    deleteSupplier: deleteMutation.mutate,
  };
}
