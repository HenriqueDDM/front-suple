import { useQuery } from "@tanstack/react-query";
import { getProductsService, queryKeys } from "@/services";

const productsService = getProductsService();

export function useProductProfile(productId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.profile(productId ?? ""),
    queryFn: () => productsService.getProfile(productId!),
    enabled: Boolean(productId),
  });
}
