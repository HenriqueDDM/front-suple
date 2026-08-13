import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { useStoreUsers } from "@/features/settings/hooks/useStoreUsers";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { Loading } from "@/shared/components/Loading";
import { FormField } from "@/shared/components/forms/FormField";
import { FormGrid } from "@/shared/components/forms/FormGrid";
import { useAuth } from "@/shared/contexts/AuthContext";
import { ApiError } from "@/services";
import type { CreateStoreUserDto } from "@/types/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { toast } from "sonner";

const ROLE_LABEL: Record<CreateStoreUserDto["role"], string> = {
  ADMIN: "Admin",
  MANAGER: "Gerente",
  SELLER: "Vendedor",
};

const EMPTY_FORM: CreateStoreUserDto = {
  name: "",
  email: "",
  password: "",
  role: "SELLER",
};

export function TeamSettingsPanel() {
  const { user } = useAuth();
  const { items, isLoading, createUser, removeUser, isCreating } = useStoreUsers();
  const [form, setForm] = useState<CreateStoreUserDto>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Informe nome e e-mail.");
      return;
    }
    if (form.password.trim().length < 8) {
      toast.error("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (form.password.trim() === "password123") {
      toast.error("Escolha uma senha diferente da senha padrão de demonstração.");
      return;
    }

    try {
      await createUser({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });
      toast.success("Usuário criado.");
      setForm(EMPTY_FORM);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Não foi possível criar o usuário.",
      );
    }
  };

  const handleRemove = async () => {
    if (!deleteId) return;
    try {
      await removeUser(deleteId);
      toast.success("Usuário removido.");
      setDeleteId(null);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Não foi possível remover o usuário.",
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Equipe da loja</CardTitle>
          <CardDescription>
            Crie acessos para gerente e vendedor. Só o admin da loja gerencia a equipe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormGrid>
            <FormField label="Nome">
              <Input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </FormField>
            <FormField label="E-mail">
              <Input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </FormField>
            <FormField label="Senha inicial">
              <Input
                type="password"
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </FormField>
            <FormField label="Perfil">
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    role: value as CreateStoreUserDto["role"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABEL) as CreateStoreUserDto["role"][]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABEL[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </FormGrid>
          <Button type="button" onClick={() => void handleCreate()} disabled={isCreating}>
            <Plus className="h-4 w-4" />
            {isCreating ? "Criando..." : "Adicionar usuário"}
          </Button>

          {isLoading ? (
            <Loading rows={3} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum usuário"
              description="Adicione o primeiro membro da equipe."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{ROLE_LABEL[member.role]}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={member.id === user?.userId}
                        onClick={() => setDeleteId(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remover usuário?"
        description="A pessoa perde o acesso à loja imediatamente."
        confirmLabel="Remover"
        onConfirm={() => void handleRemove()}
      />
    </>
  );
}
