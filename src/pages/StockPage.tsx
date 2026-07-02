import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StockBadge } from "@/components/StockBadge";
import { useStockMovements } from "@/hooks/useStockMovements";
import { products } from "@/services/mock/products";
import { formatDateTime, movementTypeLabel } from "@/utils/format";
import type { MovementType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const typeStyles: Record<MovementType, string> = {
  entry: "bg-success/12 text-success border-success/20",
  exit: "bg-destructive/12 text-destructive border-destructive/20",
  adjustment: "bg-warning/15 text-warning border-warning/25",
};

export function StockPage() {
  const { items: movements, createMovement } = useStockMovements();
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<MovementType>("entry");
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const lastMovementFor = (pid: string) =>
    movements.find((m) => m.productId === pid)?.createdAt ?? null;

  const save = () => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      toast.error("Selecione um produto.");
      return;
    }
    createMovement({
      productId: product.id,
      productName: product.name,
      type,
      quantity: type === "exit" ? -Math.abs(quantity) : quantity,
      reason: reason || movementTypeLabel[type],
    });
    toast.success("Movimentação registrada.");
    setOpen(false);
    setProductId("");
    setQuantity(0);
    setReason("");
    setType("entry");
  };

  return (
    <>
      <PageHeader
        title="Estoque"
        description="Controle de níveis e movimentações."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Nova movimentação
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0 sm:p-2">
          <div className="overflow-x-auto">
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
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-9 w-9 shrink-0 rounded-md object-cover"
                        />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{p.quantity}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {p.minStock}
                    </TableCell>
                    <TableCell>
                      <StockBadge quantity={p.quantity} minStock={p.minStock} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(lastMovementFor(p.id))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold">Movimentações recentes</h3>
          <div className="space-y-2">
            {movements.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <Badge variant="outline" className={typeStyles[m.type]}>
                  {movementTypeLabel[m.type]}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.productName}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.reason}</p>
                </div>
                <span className="shrink-0 text-sm font-medium">
                  {m.quantity > 0 ? "+" : ""}
                  {m.quantity}
                </span>
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                  {formatDateTime(m.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova movimentação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Produto</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as MovementType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entrada</SelectItem>
                    <SelectItem value="exit">Saída</SelectItem>
                    <SelectItem value="adjustment">Ajuste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Motivo</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Descreva o motivo da movimentação"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
