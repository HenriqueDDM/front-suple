import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, Boxes, FileUp, Package, Plus, Warehouse } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCard } from "@/shared/components/StatsCard";
import { StockBadge } from "@/shared/components/StockBadge";
import { DataTable } from "@/shared/components/DataTable";
import { ProductThumbnailInline } from "@/shared/components/ProductThumbnail";
import { MovementTypeSelect } from "@/shared/components/MovementTypeSelect";
import { SearchInput } from "@/shared/components/SearchInput";
import { StockMovementItem } from "@/features/stock/components/StockMovementItem";
import { ImportInvoiceDialog } from "@/features/stock/components/ImportInvoiceDialog";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormField } from "@/shared/components/forms/FormField";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useStockMovements } from "@/features/stock/hooks/useStockMovements";
import { useSearchFilter } from "@/shared/hooks/useSearchFilter";
import { formatCurrency, formatDateTime, stockStatus } from "@/shared/utils/format";
import { parseNumericInput } from "@/shared/utils/number";
import { ApiError } from "@/services";
import type { MovementType, Product } from "@/types";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type StockFilter = "all" | "low";

export function StockPage() {
  const { items: products } = useProducts();
  const { items: movements, createMovement, isCreating } = useStockMovements();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [movementType, setMovementType] = useState<MovementType>("entry");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  const getProductSearchText = useCallback(
    (product: Product) => `${product.name} ${product.brand} ${product.barcode}`,
    [],
  );

  const stats = useMemo(() => {
    const lowCount = products.filter(
      (product) => stockStatus(product.quantity, product.minStock) !== "in_stock",
    ).length;
    const inventoryValue = products.reduce(
      (sum, product) => sum + product.quantity * product.purchasePrice,
      0,
    );
    return {
      skuCount: products.length,
      lowCount,
      inventoryValue,
    };
  }, [products]);

  const filteredByStatus = useMemo(() => {
    if (stockFilter === "low") {
      return products.filter(
        (product) => stockStatus(product.quantity, product.minStock) !== "in_stock",
      );
    }
    return products;
  }, [products, stockFilter]);

  const filteredProducts = useSearchFilter(filteredByStatus, searchQuery, getProductSearchText);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const rank = (product: Product) => {
        const status = stockStatus(product.quantity, product.minStock);
        if (status === "out_of_stock") return 0;
        if (status === "low_stock") return 1;
        return 2;
      };
      return rank(a) - rank(b) || a.name.localeCompare(b.name, "pt-BR");
    });
  }, [filteredProducts]);

  const lastMovementByProductId = useMemo(() => {
    const map = new Map<string, string>();
    for (const movement of movements) {
      if (!map.has(movement.productId)) {
        map.set(movement.productId, movement.createdAt);
      }
    }
    return map;
  }, [movements]);

  const selectedProduct = products.find((item) => item.id === productId);
  const quantityLabel =
    movementType === "adjustment" ? "Nova quantidade" : "Quantidade";

  const handleSave = useCallback(async () => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      toast.error("Selecione um produto.");
      return;
    }

    if (movementType !== "adjustment" && quantity < 1) {
      toast.error("Informe uma quantidade maior que zero.");
      return;
    }

    if (movementType === "adjustment" && quantity < 0) {
      toast.error("A quantidade não pode ser negativa.");
      return;
    }

    if (movementType === "exit" && quantity > product.quantity) {
      toast.error("Saída maior que o estoque atual.");
      return;
    }

    try {
      await createMovement({
        productId: product.id,
        type: movementType,
        quantity,
        reason: reason || undefined,
      });

      toast.success("Movimentação registrada.");
      setIsDialogOpen(false);
      setProductId("");
      setQuantity(0);
      setReason("");
      setMovementType("entry");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Não foi possível registrar a movimentação.";
      toast.error(message);
    }
  }, [createMovement, movementType, productId, products, quantity, reason]);

  return (
    <>
      <PageHeader
        title="Estoque"
        description="Controle de níveis e movimentações."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <FileUp className="h-4 w-4" /> Importar XML
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Nova movimentação
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard title="SKUs" value={String(stats.skuCount)} icon={Package} accent="primary" />
        <StatsCard
          title="Atenção"
          value={String(stats.lowCount)}
          icon={AlertTriangle}
          accent={stats.lowCount > 0 ? "warning" : "success"}
          hint="baixo ou esgotado"
        />
        <StatsCard
          title="Valor em estoque"
          value={formatCurrency(stats.inventoryValue)}
          icon={Warehouse}
          accent="success"
          hint="custo de compra"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar produto, marca ou código..."
          className="sm:max-w-sm"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={stockFilter === "all" ? "default" : "outline"}
            onClick={() => setStockFilter("all")}
          >
            <Boxes className="h-4 w-4" /> Todos
          </Button>
          <Button
            type="button"
            size="sm"
            variant={stockFilter === "low" ? "default" : "outline"}
            onClick={() => setStockFilter("low")}
          >
            <AlertTriangle className="h-4 w-4" /> Estoque baixo
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-2">
          <DataTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-center">Estoque mínimo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última movimentação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => {
                    const status = stockStatus(product.quantity, product.minStock);
                    return (
                      <TableRow
                        key={product.id}
                        className={cn(
                          status !== "in_stock" && "bg-warning/5",
                        )}
                      >
                        <TableCell>
                          <ProductThumbnailInline
                            imageUrl={product.imageUrl}
                            name={product.name}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell className="text-center font-medium">{product.quantity}</TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {product.minStock}
                        </TableCell>
                        <TableCell>
                          <StockBadge quantity={product.quantity} minStock={product.minStock} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDateTime(lastMovementByProductId.get(product.id) ?? null)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </DataTable>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold">Movimentações recentes</h3>
          <div className="space-y-2">
            {movements.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma movimentação registrada.</p>
            ) : (
              movements.map((movement) => (
                <StockMovementItem key={movement.id} movement={movement} />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <FormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Nova movimentação"
        onSubmit={() => void handleSave()}
        submitLabel={isCreating ? "Salvando..." : "Registrar"}
        className="sm:max-w-lg"
      >
        <div className="space-y-4">
          <FormField label="Produto">
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.quantity} un.)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tipo">
              <MovementTypeSelect value={movementType} onValueChange={setMovementType} />
            </FormField>
            <FormField label={quantityLabel}>
              <Input
                type="number"
                min={0}
                value={quantity}
                onChange={(event) => setQuantity(parseNumericInput(event.target.value))}
              />
            </FormField>
          </div>
          {selectedProduct && movementType === "adjustment" ? (
            <p className="text-xs text-muted-foreground">
              Estoque atual: {selectedProduct.quantity} un. — informe o nível desejado.
            </p>
          ) : null}
          <FormField label="Motivo">
            <Textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              placeholder="Descreva o motivo da movimentação"
            />
          </FormField>
        </div>
      </FormDialog>

      <ImportInvoiceDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
    </>
  );
}
