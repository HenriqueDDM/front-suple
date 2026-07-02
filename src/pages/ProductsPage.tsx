import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SearchInput } from "@/components/SearchInput";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { StockBadge } from "@/components/StockBadge";
import { useProducts } from "@/hooks/useProducts";
import { categories, suppliers } from "@/services/mock/products";
import { formatCurrency } from "@/utils/format";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const empty: Omit<Product, "id"> = {
  name: "",
  brand: "",
  category: "",
  supplier: "",
  barcode: "",
  purchasePrice: 0,
  salePrice: 0,
  quantity: 0,
  minStock: 0,
  imageUrl: "",
};

export function ProductsPage() {
  const { items, createProduct, updateProduct, deleteProduct } = useProducts();
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(empty);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((p) =>
        [p.name, p.brand, p.category].join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    const { id, ...rest } = p;
    setForm(rest);
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Informe o nome do produto.");
      return;
    }
    if (editing) {
      updateProduct(editing.id, form);
      toast.success("Produto atualizado.");
    } else {
      createProduct(form);
      toast.success("Produto cadastrado.");
    }
    setDialogOpen(false);
  };

  const set = (key: keyof typeof form, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <>
      <PageHeader
        title="Produtos"
        description="Gerencie o catálogo da sua loja."
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Novo Produto
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar por nome, marca ou categoria..."
            className="max-w-sm"
          />

          {filtered.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Nenhum produto encontrado"
              description="Ajuste a busca ou cadastre um novo produto."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Compra</TableHead>
                    <TableHead className="text-right">Venda</TableHead>
                    <TableHead className="text-center">Qtd.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="h-10 w-10 shrink-0 rounded-md object-cover"
                          />
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.brand}</TableCell>
                      <TableCell className="text-muted-foreground">{p.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(p.purchasePrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(p.salePrice)}</TableCell>
                      <TableCell className="text-center">{p.quantity}</TableCell>
                      <TableCell>
                        <StockBadge quantity={p.quantity} minStock={p.minStock} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setConfirmId(p.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Marca</Label>
              <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fornecedor</Label>
              <Select value={form.supplier} onValueChange={(v) => set("supplier", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Código de barras</Label>
              <Input value={form.barcode} onChange={(e) => set("barcode", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Preço de compra</Label>
              <Input
                type="number"
                value={form.purchasePrice}
                onChange={(e) => set("purchasePrice", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Preço de venda</Label>
              <Input
                type="number"
                value={form.salePrice}
                onChange={(e) => set("salePrice", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => set("quantity", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Estoque mínimo</Label>
              <Input
                type="number"
                value={form.minStock}
                onChange={(e) => set("minStock", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Imagem (URL)</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(o) => !o && setConfirmId(null)}
        title="Excluir produto?"
        description="O produto será removido do catálogo."
        confirmLabel="Excluir"
        onConfirm={() => {
          if (confirmId) {
            deleteProduct(confirmId);
            toast.success("Produto excluído.");
          }
          setConfirmId(null);
        }}
      />
    </>
  );
}
