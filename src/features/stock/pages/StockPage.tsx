import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { StockBadge } from "@/shared/components/StockBadge";
import { DataTable } from "@/shared/components/DataTable";
import { ProductThumbnailInline } from "@/shared/components/ProductThumbnail";
import { MovementTypeSelect } from "@/shared/components/MovementTypeSelect";
import { StockMovementItem } from "@/features/stock/components/StockMovementItem";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormField } from "@/shared/components/forms/FormField";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useStockMovements } from "@/features/stock/hooks/useStockMovements";
import { formatDateTime } from "@/shared/utils/format";
import { parseNumericInput } from "@/shared/utils/number";
import type { MovementType } from "@/types";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { toast } from "sonner";

export function StockPage() {
  const { items: products } = useProducts();
  const { items: movements, createMovement } = useStockMovements();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [movementType, setMovementType] = useState<MovementType>("entry");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const lastMovementByProductId = useMemo(() => {
    const map = new Map<string, string>();
    for (const movement of movements) {
      if (!map.has(movement.productId)) {
        map.set(movement.productId, movement.createdAt);
      }
    }
    return map;
  }, [movements]);

  const handleSave = useCallback(() => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      toast.error("Selecione um produto.");
      return;
    }

    createMovement({
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
  }, [createMovement, movementType, productId, quantity, reason]);

  return (
    <>
      <PageHeader
        title="Estoque"
        description="Controle de níveis e movimentações."
        actions={
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Nova movimentação
          </Button>
        }
      />

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
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <ProductThumbnailInline
                        imageUrl={product.imageUrl}
                        name={product.name}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="text-center">{product.quantity}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </DataTable>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold">Movimentações recentes</h3>
          <div className="space-y-2">
            {movements.map((movement) => (
              <StockMovementItem key={movement.id} movement={movement} />
            ))}
          </div>
        </CardContent>
      </Card>

      <FormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Nova movimentação"
        onSubmit={handleSave}
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
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tipo">
              <MovementTypeSelect value={movementType} onValueChange={setMovementType} />
            </FormField>
            <FormField label="Quantidade">
              <Input
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(parseNumericInput(event.target.value))}
              />
            </FormField>
          </div>
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
    </>
  );
}
