"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminUser, hasAnyAdmin } from "@/services/users";

export interface SetupState {
  error?: string;
}

const setupSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.email("Informe um email válido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export async function createFirstAdminAction(
  _prevState: SetupState | undefined,
  formData: FormData
): Promise<SetupState> {
  const parsed = setupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  // Re-check right before writing: closes the race where two people submit
  // "Criar Conta de Administrador" at the same time.
  if (await hasAnyAdmin()) {
    return { error: "Já existe um administrador cadastrado. Faça login normalmente." };
  }

  try {
    await createAdminUser(parsed.data);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível criar a conta." };
  }

  // Redirect (not auto sign-in) so the success confirmation survives even if
  // a fresh Supabase Auth user can't sign in immediately after creation —
  // previously an auto sign-in attempt here could fail silently and drop the
  // admin back on a bare login screen with no trace the account existed.
  redirect("/admin/login?created=1");
}
