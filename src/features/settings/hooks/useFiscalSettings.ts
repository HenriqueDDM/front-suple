import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFiscalService, queryKeys } from "@/services";
import type { UpdateFiscalSettingsDto } from "@/types/api";

const fiscalService = getFiscalService();

export function useFiscalSettings() {
  const queryClient = useQueryClient();

  const {
    data: fiscalSettings,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.fiscal.settings,
    queryFn: () => fiscalService.getSettings(),
  });

  const updateMutation = useMutation({
    mutationFn: (dto: UpdateFiscalSettingsDto) => fiscalService.updateSettings(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.fiscal.settings });
    },
  });

  return {
    fiscalSettings,
    isLoading,
    error,
    updateFiscalSettings: updateMutation.mutateAsync,
    isSaving: updateMutation.isPending,
  };
}

export function useSaleInvoiceActions() {
  const queryClient = useQueryClient();

  const emitMutation = useMutation({
    mutationFn: ({ saleId, consumerCpf }: { saleId: string; consumerCpf?: string }) =>
      fiscalService.emitForSale(saleId, consumerCpf),
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.fiscal.sale(vars.saleId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, justificativa }: { id: string; justificativa: string }) =>
      fiscalService.cancelInvoice(id, justificativa),
  });

  return {
    emitInvoice: emitMutation.mutateAsync,
    cancelInvoice: cancelMutation.mutateAsync,
    isEmitting: emitMutation.isPending,
    isCancelling: cancelMutation.isPending,
  };
}
