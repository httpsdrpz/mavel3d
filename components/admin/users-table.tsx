"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, MoreHorizontal, Pencil, Plus, Trash2, UserCog, UserX } from "lucide-react";

import {
  createAdminUserAction,
  deleteAdminUserAction,
  resetAdminPasswordAction,
  setAdminActiveAction,
  updateAdminProfileAction,
} from "@/app/admin/(protected)/usuarios/actions";
import type { AdminUser } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SearchInput } from "@/components/admin/search-input";
import { Pagination } from "@/components/admin/pagination";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { UserFormDialog, type UserFormSubmitData } from "@/components/admin/user-form-dialog";
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog";

const PAGE_SIZE = 10;

function formatDate(iso: string | null) {
  if (!iso) return "Nunca";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function UsersTable({ users, currentUserId }: { users: AdminUser[]; currentUserId: string }) {
  const router = useRouter();

  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<AdminUser | null>(null);
  const [resetTarget, setResetTarget] = React.useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<AdminUser | null>(null);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return users;
    const q = query.trim().toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddForm() {
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEditForm(user: AdminUser) {
    setEditingUser(user);
    setFormOpen(true);
  }

  async function handleFormSubmit(data: UserFormSubmitData) {
    try {
      if (editingUser) {
        await updateAdminProfileAction(editingUser.id, { name: data.name, email: data.email });
        toast.success("Administrador atualizado");
      } else {
        await createAdminUserAction({ name: data.name, email: data.email, password: data.password! });
        toast.success("Administrador criado com sucesso");
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o administrador");
    }
  }

  async function handleResetPassword(password: string) {
    if (!resetTarget) return;
    try {
      await resetAdminPasswordAction(resetTarget.id, password);
      toast.success("Senha redefinida com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível redefinir a senha");
    }
  }

  async function handleToggleActive(user: AdminUser) {
    try {
      await setAdminActiveAction(user.id, !user.active);
      toast.success(user.active ? "Usuário desativado" : "Usuário ativado");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o status");
    }
  }

  async function handleDelete(user: AdminUser) {
    try {
      await deleteAdminUserAction(user.id);
      toast.success("Usuário excluído");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o usuário");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white">
      <div className="flex flex-col gap-4 border-b border-border p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Administradores</h2>
            <p className="text-sm text-muted-foreground">Quem pode acessar o painel da loja.</p>
          </div>
          <Button onClick={openAddForm}>
            <Plus /> Novo administrador
          </Button>
        </div>

        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Buscar por nome ou email..."
          className="sm:max-w-xs"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Último acesso</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <span className="font-medium text-foreground">{user.name || "—"}</span>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </TableCell>
              <TableCell>
                <Badge variant="purple">Admin</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(user.lastSignInAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={user.active}
                    onCheckedChange={() => handleToggleActive(user)}
                    aria-label={user.active ? "Desativar usuário" : "Ativar usuário"}
                  />
                  <Badge variant={user.active ? "success" : "outline"}>
                    {user.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Ações do usuário">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => openEditForm(user)}>
                      <Pencil /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setResetTarget(user)}>
                      <KeyRound /> Redefinir senha
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleToggleActive(user)}>
                      <UserX /> {user.active ? "Desativar" : "Ativar"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={user.id === currentUserId}
                      onSelect={() => setDeleteTarget(user)}
                    >
                      <Trash2 /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filtered.length === 0 && (
        <EmptyState
          icon={UserCog}
          title="Nenhum administrador encontrado"
          description="Ajuste a busca ou crie um novo administrador."
        />
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingUser ?? undefined}
        onSubmit={handleFormSubmit}
      />

      <ResetPasswordDialog
        open={!!resetTarget}
        onOpenChange={(open) => !open && setResetTarget(null)}
        userName={resetTarget?.name}
        onSubmit={handleResetPassword}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
