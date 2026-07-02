import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SearchInput } from "@/components/SearchInput";
import { EmptyState } from "@/components/EmptyState";
import { useCustomers } from "@/hooks/useCustomers";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Customer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { toast } from "sonner";

const empty = {
  name: "",
  phone: "",
  email: "",
  cpf: "",
  birthDate: "",
  notes: "",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function CustomersPage() {
  const { items, createCustomer } = useCustomers();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const filtered = useMemo(
    () =>
      items.filter((c) =>
        [c.name, c.email, c.cpf, c.phone]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    createCustomer(form as Omit<Customer, "id" | "lastPurchase" | "totalSpent">);
    toast.success("Cliente cadastrado.");
    setForm(empty);
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Gerencie a base de clientes da loja."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Novo Cliente
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Buscar por nome, e-mail ou CPF..."
            className="max-w-sm"
          />

          {filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum cliente encontrado"
              description="Ajuste a busca ou cadastre um novo cliente."
            />
          ) : (
            <div className="overflow-x-auto">
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
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                              {initials(c.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{c.email}</TableCell>
                      <TableCell className="text-muted-foreground">{c.cpf}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(c.lastPurchase)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(c.totalSpent)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo cliente</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>CPF</Label>
              <Input value={form.cpf} onChange={(e) => set("cpf", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nascimento</Label>
              <Input
                type="date"
                value={form.birthDate}
                onChange={(e) => set("birthDate", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
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
