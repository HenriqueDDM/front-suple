import { useCallback, useMemo, useRef, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useProducts } from "@/features/products/hooks/useProducts";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormField } from "@/shared/components/forms/FormField";
import { getPurchasesService, queryKeys, ApiError } from "@/services";
import type { PurchaseImportPreview } from "@/types/api/purchases";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import { parseNumericInput } from "@/shared/utils/number";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { toast } from "sonner";

const purchasesService = getPurchasesService();
const NEW_PRODUCT = "__new__";

interface ImportLineState {
  productId: string | null;
  createProductName: string;
  salePrice: number;
}

interface ImportInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function paymentMethodLabel(method: string): string {
  switch (method) {
    case "boleto":
      return "Boleto";
    case "pix":
      return "Pix";
    case "cash":
      return "Dinheiro";
    case "credit":
      return "Cartão crédito";
    case "debit":
      return "Cartão débito";
    default:
      return method || "Não informado";
  }
}

export function ImportInvoiceDialog({ open, onOpenChange }: ImportInvoiceDialogProps) {
  const queryClient = useQueryClient();
  const { items: products } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [xmlContent, setXmlContent] = useState("");
  const [preview, setPreview] = useState<PurchaseImportPreview | null>(null);
  const [lineState, setLineState] = useState<ImportLineState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = useCallback(() => {
    setXmlContent("");
    setPreview(null);
    setLineState([]);
    setIsLoading(false);
    setIsSubmitting(false);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) reset();
      onOpenChange(nextOpen);
    },
    [onOpenChange, reset],
  );

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".xml")) {
      toast.error("Selecione um arquivo XML de NF-e.");
      return;
    }

    setIsLoading(true);
    try {
      const xml = await file.text();
      setXmlContent(xml);
      const result = await purchasesService.previewImport(xml, file.name);
      setPreview(result);
      setLineState(
        result.items.map((item) => ({
          productId: item.suggestedProductId,
          createProductName: item.description,
          salePrice: item.suggestedSalePrice,
        })),
      );

      if (result.isDuplicate) {
        toast.warning("Esta nota já foi importada anteriormente.");
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Não foi possível ler o XML.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!preview || !xmlContent) return;

    if (preview.isDuplicate) {
      toast.error("Esta nota já foi importada.");
      return;
    }

    setIsSubmitting(true);
    try {
      await purchasesService.confirmImport({
        xml: xmlContent,
        accessKey: preview.accessKey ?? undefined,
        supplierName: preview.supplierName ?? undefined,
        supplierCnpj: preview.supplierCnpj ?? undefined,
        number: preview.number ?? undefined,
        issueDate: preview.issueDate ?? undefined,
        paymentMethod: preview.paymentMethod,
        installments: preview.installments,
        items: preview.items.map((item, index) => {
          const state = lineState[index];
          const isNew = !state?.productId;
          return {
            productId: isNew ? null : state.productId,
            description: item.description,
            quantity: item.quantity,
            unitCost: item.unitCost,
            salePrice: state?.salePrice ?? item.suggestedSalePrice,
            ncm: item.ncm ?? undefined,
            createProductName: isNew ? state?.createProductName || item.description : undefined,
          };
        }),
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.stock.movements }),
        queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.purchases.all }),
      ]);

      toast.success("Nota importada com sucesso.");
      handleOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Não foi possível importar a nota.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [handleOpenChange, lineState, preview, queryClient, xmlContent]);

  const totalCost = useMemo(
    () => preview?.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0) ?? 0,
    [preview?.items],
  );

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Importar NF-e (XML)"
      onSubmit={() => void handleConfirm()}
      submitLabel={isSubmitting ? "Importando..." : "Confirmar importação"}
      className="sm:max-w-4xl"
    >
      {!preview ? (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml,text/xml,application/xml"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center transition-colors hover:border-primary/50 hover:bg-accent/50"
          >
            {isLoading ? (
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            ) : (
              <FileUp className="h-10 w-10 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">Selecione o XML da nota fiscal</p>
              <p className="mt-1 text-sm text-muted-foreground">
                O sistema lê fornecedor, itens, boletos e cadastra automaticamente.
              </p>
            </div>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Fornecedor</p>
              <p className="font-medium">{preview.supplierName ?? "—"}</p>
              {preview.supplierCnpj ? (
                <p className="text-xs text-muted-foreground">CNPJ {preview.supplierCnpj}</p>
              ) : null}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nota</p>
              <p className="font-medium">
                {preview.number ? `NF ${preview.number}` : "—"}
                {preview.issueDate ? ` · ${formatDate(preview.issueDate)}` : ""}
              </p>
              {preview.accessKey ? (
                <p className="truncate text-xs text-muted-foreground">{preview.accessKey}</p>
              ) : null}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pagamento</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{paymentMethodLabel(preview.paymentMethod)}</p>
                {preview.paymentMethod === "boleto" ? (
                  <Badge variant="secondary">Boleto a pagar</Badge>
                ) : null}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total da nota</p>
              <p className="font-medium">{formatCurrency(totalCost)}</p>
            </div>
          </div>

          {preview.installments.length > 0 ? (
            <div className="space-y-2">
              <Label>Parcelas / boletos detectados no XML</Label>
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.installments.map((installment, index) => (
                      <TableRow key={`${installment.number}-${index}`}>
                        <TableCell>{installment.number || index + 1}</TableCell>
                        <TableCell>{formatDate(installment.dueDate)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(installment.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}

          {preview.isDuplicate ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Esta nota já foi importada. Não é possível importar novamente.
            </p>
          ) : null}

          <div className="space-y-2">
            <Label>Itens — vincule produtos e defina preço de venda</Label>
            <ScrollArea className="max-h-80 rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Custo</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Preço venda</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.items.map((item, index) => {
                    const state = lineState[index];
                    const isNew = !state?.productId;
                    return (
                      <TableRow key={`${item.description}-${index}`}>
                        <TableCell className="max-w-[180px]">
                          <p className="truncate text-sm font-medium">{item.description}</p>
                          {item.ncm ? (
                            <p className="text-xs text-muted-foreground">NCM {item.ncm}</p>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitCost)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={isNew ? NEW_PRODUCT : state.productId ?? NEW_PRODUCT}
                            onValueChange={(value) => {
                              setLineState((current) =>
                                current.map((line, lineIndex) =>
                                  lineIndex === index
                                    ? {
                                        ...line,
                                        productId: value === NEW_PRODUCT ? null : value,
                                      }
                                    : line,
                                ),
                              );
                            }}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={NEW_PRODUCT}>Criar novo produto</SelectItem>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isNew ? (
                            <Input
                              className="mt-1 h-8"
                              value={state?.createProductName ?? ""}
                              onChange={(event) => {
                                const value = event.target.value;
                                setLineState((current) =>
                                  current.map((line, lineIndex) =>
                                    lineIndex === index
                                      ? { ...line, createProductName: value }
                                      : line,
                                  ),
                                );
                              }}
                              placeholder="Nome do novo produto"
                            />
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            className="h-8 text-right"
                            value={state?.salePrice ?? item.suggestedSalePrice}
                            onChange={(event) => {
                              const value = parseNumericInput(event.target.value);
                              setLineState((current) =>
                                current.map((line, lineIndex) =>
                                  lineIndex === index ? { ...line, salePrice: value } : line,
                                ),
                              );
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
              }}
            >
              Trocar XML
            </Button>
          </div>
        </div>
      )}
    </FormDialog>
  );
}
