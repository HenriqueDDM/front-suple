import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomersService, queryKeys } from "@/services";
import type { CreateCustomerDto, UpdateCustomerDto } from "@/types/api";

const customersService = getCustomersService();

export function useCustomers() {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.customers.all,
    queryFn: () => customersService.findAll(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateCustomerDto) => customersService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCustomerDto }) =>
      customersService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });

  return {
    items,
    isLoading,
    error,
    createCustomer: createMutation.mutate,
    updateCustomer: (id: string, dto: UpdateCustomerDto) => updateMutation.mutate({ id, dto }),
    deleteCustomer: deleteMutation.mutate,
  };
}
