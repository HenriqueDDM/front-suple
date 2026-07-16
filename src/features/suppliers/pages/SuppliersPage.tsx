import { useCallback, useState } from "react";
import { Plus, Truck } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { EntityListCard } from "@/shared/components/EntityListCard";
import { DataTable } from "@/shared/components/DataTable";
import { SupplierTableRow } from "@/features/suppliers/components/SupplierTableRow";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormField } from "@/shared/components/forms/FormField";
import { FormGrid } from "@/shared/components/forms/FormGrid";
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import { useSearchFilter } from "@/shared/hooks/useSearchFilter";
import { useFormState } from "@/shared/hooks/useFormState";
import type { CreateSupplierDto } from "@/types/api";
import type { Supplier } from "@/types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { toast } from "sonner";

const EMPTY_SUPPLIER: CreateSupplierDto = {
  name: "",
  contactName: "",
  phone: "",
  email: "",
  cnpj: "",
  notes: "",
};

export function SuppliersPage() {
  const { items, createSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { form, setField, reset } = useFormState(EMPTY_SUPPLIER);

  const getSupplierSearchText = useCallback(
    (supplier: Supplier) =>
      [supplier.name, supplier.contactName, supplier.email, supplier.cnpj, supplier.phone].join(
        " ",
      ),
    [],
  );

  const filteredSuppliers = useSearchFilter(items, searchQuery, getSupplierSearchText);

  const handleOpenCreate = useCallback(() => {
    setEditingSupplier(null);
    reset(EMPTY_SUPPLIER);
    setIsDialogOpen(true);
  }, [reset]);

  const handleOpenEdit = useCallback(
    (supplier: Supplier) => {
      setEditingSupplier(supplier);
      const { id: _id, ...rest } = supplier;
      reset(rest);
      setIsDialogOpen(true);
    },
    [reset],
  );

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      toast.error("Informe o nome do fornecedor.");
      return;
    }

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, form);
      toast.success("Fornecedor atualizado.");
    } else {
      createSupplier(form);
      toast.success("Fornecedor cadastrado.");
    }

    setIsDialogOpen(false);
  }, [createSupplier, editingSupplier, form, updateSupplier]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTargetId) {
      deleteSupplier(deleteTargetId);
      toast.success("Fornecedor excluído.");
    }
    setDeleteTargetId(null);
  }, [deleteTargetId, deleteSupplier]);

  return (
    <>
      <PageHeader
        title="Fornecedores"
        description="Cadastre fornecedores e veja o histórico de compras importadas por NF-e."
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" /> Novo fornecedor
          </Button>
        }
      />

      <EntityListCard
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por nome, CNPJ ou contato..."
        isEmpty={filteredSuppliers.length === 0}
        emptyState={
          <EmptyState
            icon={Truck}
            title="Nenhum fornecedor encontrado"
            description="Cadastre um fornecedor para usá-lo nos produtos."
          />
        }
      >
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <SupplierTableRow
                  key={supplier.id}
                  supplier={supplier}
                  onEdit={handleOpenEdit}
                  onDelete={setDeleteTargetId}
                />
              ))}
            </TableBody>
          </Table>
        </DataTable>
      </EntityListCard>

      <FormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingSupplier ? "Editar fornecedor" : "Novo fornecedor"}
        onSubmit={handleSave}
        className="sm:max-w-lg"
      >
        <FormGrid>
          <FormField label="Nome" className="sm:col-span-2">
            <Input value={form.name} onChange={(event) => setField("name", event.target.value)} />
          </FormField>
          <FormField label="Contato">
            <Input
              value={form.contactName}
              onChange={(event) => setField("contactName", event.target.value)}
            />
          </FormField>
          <FormField label="Telefone">
            <Input value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
          </FormField>
          <FormField label="Email">
            <Input value={form.email} onChange={(event) => setField("email", event.target.value)} />
          </FormField>
          <FormField label="CNPJ">
            <Input value={form.cnpj} onChange={(event) => setField("cnpj", event.target.value)} />
          </FormField>
          <FormField label="Observações" className="sm:col-span-2">
            <Textarea
              value={form.notes}
              onChange={(event) => setField("notes", event.target.value)}
            />
          </FormField>
        </FormGrid>
      </FormDialog>

      <ConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Excluir fornecedor?"
        description="O fornecedor será removido da lista."
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
