import { useQuery } from "@tanstack/react-query";
import { getCustomersService, queryKeys } from "@/services";

const customersService = getCustomersService();

export function useCustomerProfile(customerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.customers.profile(customerId ?? ""),
    queryFn: () => customersService.getProfile(customerId!),
    enabled: Boolean(customerId),
  });
}
