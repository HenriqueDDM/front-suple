import { useCallback, useState } from "react";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { EntityListCard } from "@/shared/components/EntityListCard";
import { DataTable } from "@/shared/components/DataTable";
import { CustomerTableRow } from "@/features/customers/components/CustomerTableRow";
import { FormDialog } from "@/shared/components/forms/FormDialog";
import { FormField } from "@/shared/components/forms/FormField";
import { FormGrid } from "@/shared/components/forms/FormGrid";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useSearchFilter } from "@/shared/hooks/useSearchFilter";
import { useFormState } from "@/shared/hooks/useFormState";
import type { CreateCustomerDto } from "@/types/api";
import type { Customer } from "@/types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { toast } from "sonner";

const EMPTY_CUSTOMER: CreateCustomerDto = {
  name: "",
  phone: "",
  email: "",
  cpf: "",
  birthDate: "",
  notes: "",
};

export function CustomersPage() {
  const { items, createCustomer } = useCustomers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { form, setField, reset } = useFormState(EMPTY_CUSTOMER);

  const getCustomerSearchText = useCallback(
    (customer: Customer) => [customer.name, customer.email, customer.cpf, customer.phone].join(" "),
    [],
  );

  const filteredCustomers = useSearchFilter(items, searchQuery, getCustomerSearchText);

  const handleOpenCreate = useCallback(() => {
    reset(EMPTY_CUSTOMER);
    setIsDialogOpen(true);
  }, [reset]);

  const handleSave = useCallback(() => {
    if (!form.name.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }

    createCustomer(form);
    toast.success("Cliente cadastrado.");
    reset(EMPTY_CUSTOMER);
    setIsDialogOpen(false);
  }, [form, createCustomer, reset]);

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Gerencie a base de clientes da loja. Clique em um cliente para ver o perfil."
        actions={
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" /> Novo Cliente
          </Button>
        }
      />

      <EntityListCard
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar por nome, e-mail ou CPF..."
        isEmpty={filteredCustomers.length === 0}
        emptyState={
          <EmptyState
            icon={Users}
            title="Nenhum cliente encontrado"
            description="Ajuste a busca ou cadastre um novo cliente."
          />
        }
      >
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Última compra</TableHead>
                <TableHead className="text-right">Total gasto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <CustomerTableRow key={customer.id} customer={customer} />
              ))}
            </TableBody>
          </Table>
        </DataTable>
      </EntityListCard>

      <FormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Novo cliente"
        onSubmit={handleSave}
        className="sm:max-w-lg"
      >
        <FormGrid>
          <FormField label="Nome" className="sm:col-span-2">
            <Input value={form.name} onChange={(event) => setField("name", event.target.value)} />
          </FormField>
          <FormField label="Telefone">
            <Input value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
          </FormField>
          <FormField label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
            />
          </FormField>
          <FormField label="CPF">
            <Input value={form.cpf} onChange={(event) => setField("cpf", event.target.value)} />
          </FormField>
          <FormField label="Nascimento">
            <Input
              type="date"
              value={form.birthDate}
              onChange={(event) => setField("birthDate", event.target.value)}
            />
          </FormField>
          <FormField label="Observações" className="sm:col-span-2">
            <Textarea
              value={form.notes}
              onChange={(event) => setField("notes", event.target.value)}
              rows={3}
            />
          </FormField>
        </FormGrid>
      </FormDialog>
    </>
  );
}
