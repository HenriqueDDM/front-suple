import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductsService, queryKeys } from "@/services";
import type { CreateProductDto, UpdateProductDto } from "@/types/api";

const productsService = getProductsService();

export function useProducts() {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.products.all,
    queryFn: () => productsService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateProductDto) => productsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      productsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });

  return {
    items,
    isLoading,
    error,
    createProduct: createMutation.mutate,
    updateProduct: (id: string, dto: UpdateProductDto) => updateMutation.mutate({ id, dto }),
    deleteProduct: deleteMutation.mutate,
  };
}

export function useProductCatalog() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.products.catalog,
    queryFn: () => productsService.getCatalog(),
  });

  return {
    categories: data?.categories ?? [],
    suppliers: data?.suppliers ?? [],
    isLoading,
    error,
  };
}
