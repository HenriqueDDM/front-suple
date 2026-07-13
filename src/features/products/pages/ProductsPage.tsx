import { useCallback, useState } from "react";
import { Plus, Package } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { EntityListCard } from "@/shared/components/EntityListCard";
import { DataTable } from "@/shared/components/DataTable";
import { ProductTableRow } from "@/features/products/components/ProductTableRow";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormField } from "@/shared/components/forms/FormField";
import { FormGrid } from "@/shared/components/forms/FormGrid";
import { useProducts, useProductCatalog } from "@/features/products/hooks/useProducts";
import { useSearchFilter } from "@/shared/hooks/useSearchFilter";
import { useFormState } from "@/shared/hooks/useFormState";
import { parseNumericInput } from "@/shared/utils/number";
import type { Product } from "@/types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { toast } from "sonner";

const EMPTY_PRODUCT: Omit<Product, "id"> = {
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
  const { categories, suppliers } = useProductCatalog();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { form, setField, reset } = useFormState(EMPTY_PRODUCT);

  const getProductSearchText = useCallback(
    (product: Product) => [product.name, product.brand, product.category].join(" "),
    [],
  );

  const filteredProducts = useSearchFilter(items, searchQuery, getProductSearchText);

  const handleOpenCreate = useCallback(() => {
    setEditingProduct(null);
    reset(EMPTY_PRODUCT);
    setIsDialogOpen(true);
  }, [reset]);

  const handleOpenEdit = useCallback(
    (product: Product) => {
      setEditingProduct(product);
      const { id: _id, ...rest } = product;
      reset(rest);
      setIsDialogOpen(true);
    },
    [reset],
  );

  const handleDelete = useCallback((id: string) => {
    setDeleteTargetId(id);
  }, []);

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      toast.error("Informe o nome do produto.");
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, form);
      toast.success("Produto atualizado.");
    } else {
      createProduct(form);
      toast.success("Produto cadastrado.");
    }

    setIsDialogOpen(false);
  }, [editingProduct, form, createProduct, updateProduct]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTargetId) {
      deleteProduct(deleteTargetId);
      toast.success("Produto excluído.");
    }
    setDeleteTargetId(null);
  }, [deleteTargetId, deleteProduct]);

  return (
    <>
      <PageHeader
        title="Produtos"
        description="Gerencie o catálogo da sua loja."
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" /> Novo Produto
          </Button>
        }
      />

      <EntityListCard
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por nome, marca ou categoria..."
        isEmpty={filteredProducts.length === 0}
        emptyState={
          <EmptyState
            icon={Package}
            title="Nenhum produto encontrado"
            description="Ajuste a busca ou cadastre um novo produto."
          />
        }
      >
        <DataTable>
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
              {filteredProducts.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </DataTable>
      </EntityListCard>

      <FormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingProduct ? "Editar produto" : "Novo produto"}
        onSubmit={handleSave}
        className="sm:max-w-2xl"
      >
        <FormGrid>
          <FormField label="Nome" className="sm:col-span-2">
            <Input value={form.name} onChange={(event) => setField("name", event.target.value)} />
          </FormField>
          <FormField label="Marca">
            <Input value={form.brand} onChange={(event) => setField("brand", event.target.value)} />
          </FormField>
          <FormField label="Categoria">
            <Select value={form.category} onValueChange={(value) => setField("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Fornecedor">
            <Select value={form.supplier} onValueChange={(value) => setField("supplier", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Código de barras">
            <Input
              value={form.barcode}
              onChange={(event) => setField("barcode", event.target.value)}
            />
          </FormField>
          <FormField label="Preço de compra">
            <Input
              type="number"
              value={form.purchasePrice}
              onChange={(event) => setField("purchasePrice", parseNumericInput(event.target.value))}
            />
          </FormField>
          <FormField label="Preço de venda">
            <Input
              type="number"
              value={form.salePrice}
              onChange={(event) => setField("salePrice", parseNumericInput(event.target.value))}
            />
          </FormField>
          <FormField label="Quantidade">
            <Input
              type="number"
              value={form.quantity}
              onChange={(event) => setField("quantity", parseNumericInput(event.target.value))}
            />
          </FormField>
          <FormField label="Estoque mínimo">
            <Input
              type="number"
              value={form.minStock}
              onChange={(event) => setField("minStock", parseNumericInput(event.target.value))}
            />
          </FormField>
          <FormField label="Imagem (URL)" className="sm:col-span-2">
            <Input
              value={form.imageUrl}
              onChange={(event) => setField("imageUrl", event.target.value)}
              placeholder="https://..."
            />
          </FormField>
        </FormGrid>
      </FormDialog>

      <ConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Excluir produto?"
        description="O produto será removido do catálogo."
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
