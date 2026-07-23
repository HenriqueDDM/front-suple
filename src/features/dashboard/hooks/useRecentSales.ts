import { useQuery } from "@tanstack/react-query";
import { env } from "@/config/env";
import { useAuth } from "@/shared/contexts/AuthContext";
import { getAccessToken } from "@/services/api/auth-store";
import { getSalesService, queryKeys } from "@/services";

const salesService = getSalesService();

const DEFAULT_LIMIT = 10;

export function useRecentSales(page: number, limit = DEFAULT_LIMIT) {
  const { isLoading: authLoading } = useAuth();
  const canFetch =
    typeof window !== "undefined" &&
    !authLoading &&
    (env.useMockApi || Boolean(getAccessToken()));

  const query = useQuery({
    queryKey: queryKeys.sales.paginated(page, limit),
    queryFn: () => salesService.findPaginated({ page, limit }),
    enabled: canFetch,
    placeholderData: (previous) => previous,
  });

  return {
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? page,
    pages: query.data?.pages ?? 1,
    limit,
    isLoading: !canFetch || query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
}
