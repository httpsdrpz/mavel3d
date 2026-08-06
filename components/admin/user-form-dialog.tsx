"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { AdminUser } from "@/lib/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const createSchema = z
  .object({
    name: z.string().min(2, "Informe o nome"),
    email: z.email("Informe um email válido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const editSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  email: z.email("Informe um email válido"),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

export interface UserFormSubmitData {
  name: string;
  email: string;
  password?: string;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: AdminUser;
  onSubmit: (data: UserFormSubmitData) => void | Promise<void>;
}

function CreateForm({ onSubmit }: { onSubmit: (data: UserFormSubmitData) => void | Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ name: data.name, email: data.email, password: data.password }))}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="user-name">Nome</Label>
        <Input id="user-name" placeholder="Nome completo" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="user-email">Email</Label>
        <Input id="user-email" type="email" placeholder="admin@mavel.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="user-password">Senha</Label>
        <Input id="user-password" type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="user-confirm-password">Confirmar senha</Label>
        <Input id="user-confirm-password" type="password" placeholder="••••••••" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          Criar administrador
        </Button>
      </DialogFooter>
    </form>
  );
}

function EditForm({
  initialData,
  onSubmit,
}: {
  initialData: AdminUser;
  onSubmit: (data: UserFormSubmitData) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: initialData.name, email: initialData.email },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="edit-user-name">Nome</Label>
        <Input id="edit-user-name" placeholder="Nome completo" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="edit-user-email">Email</Label>
        <Input id="edit-user-email" type="email" placeholder="admin@mavel.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          Salvar alterações
        </Button>
      </DialogFooter>
    </form>
  );
}

export function UserFormDialog({ open, onOpenChange, initialData, onSubmit }: UserFormDialogProps) {
  async function handleSubmit(data: UserFormSubmitData) {
    await onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar administrador" : "Novo administrador"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Atualize o nome ou o email deste administrador."
              : "Crie uma nova conta com acesso total ao painel administrativo."}
          </DialogDescription>
        </DialogHeader>

        {initialData ? (
          <EditForm initialData={initialData} onSubmit={handleSubmit} />
        ) : (
          <CreateForm onSubmit={handleSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
}
