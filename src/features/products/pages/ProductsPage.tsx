import { useCallback, useState } from "react";
import { Plus, Package } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { EntityListCard } from "@/shared/components/EntityListCard";
import { DataTable } from "@/shared/components/DataTable";
import { ProductTableRow } from "@/features/products/components/ProductTableRow";
import { ProductFormFields } from "@/features/products/components/ProductFormFields";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { useProducts, useProductCatalog } from "@/features/products/hooks/useProducts";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import { useSearchFilter } from "@/shared/hooks/useSearchFilter";
import { useFormState } from "@/shared/hooks/useFormState";
import type { CreateProductDto } from "@/types/api";
import type { Product } from "@/types";
import { Button } from "@/shared/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { toast } from "sonner";

const EMPTY_PRODUCT: CreateProductDto = {
  name: "",
  brand: "",
  category: "",
  supplier: "",
  supplierId: null,
  sku: "",
  ncm: "",
  barcode: "",
  purchasePrice: 0,
  salePrice: 0,
  pricingMode: "manual",
  pricingValue: 0,
  quantity: 0,
  minStock: 0,
  imageUrl: "",
};

export function ProductsPage() {
  const { items, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useProductCatalog();
  const { items: suppliers } = useSuppliers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { form, setField, reset } = useFormState(EMPTY_PRODUCT);

  const getProductSearchText = useCallback(
    (product: Product) =>
      [
        product.name,
        product.brand,
        product.category,
        product.barcode,
        product.sku,
        product.ncm,
        product.supplier,
      ].join(" "),
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
    if (!form.barcode.trim()) {
      toast.error("Informe o código de barras.");
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
        description="Gerencie o catálogo da sua loja. Abra a ficha para ver compradores e histórico."
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" /> Novo Produto
          </Button>
        }
      />

      <EntityListCard
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por nome, SKU, NCM ou código de barras..."
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
        <ProductFormFields
          form={form}
          setField={setField}
          categories={categories}
          suppliers={suppliers}
        />
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
