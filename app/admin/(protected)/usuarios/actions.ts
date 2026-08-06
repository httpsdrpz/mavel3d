"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminSession } from "@/lib/supabase/admin";
import {
  createAdminUser,
  deleteAdminUser,
  resetAdminPassword,
  setAdminActive,
  updateAdminProfile,
  type CreateAdminUserInput,
} from "@/services/users";

const createSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  email: z.email("Informe um email válido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

const profileSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  email: z.email("Informe um email válido"),
});

const passwordSchema = z.string().min(8, "A senha deve ter pelo menos 8 caracteres");

export async function createAdminUserAction(input: CreateAdminUserInput) {
  await requireAdminSession();
  const parsed = createSchema.parse(input);
  const user = await createAdminUser(parsed);
  revalidatePath("/admin/usuarios");
  return user;
}

export async function updateAdminProfileAction(id: string, input: { name: string; email: string }) {
  await requireAdminSession();
  const parsed = profileSchema.parse(input);
  await updateAdminProfile(id, parsed);
  revalidatePath("/admin/usuarios");
}

export async function resetAdminPasswordAction(id: string, password: string) {
  await requireAdminSession();
  await resetAdminPassword(id, passwordSchema.parse(password));
  revalidatePath("/admin/usuarios");
}

export async function setAdminActiveAction(id: string, active: boolean) {
  await requireAdminSession();
  await setAdminActive(id, active);
  revalidatePath("/admin/usuarios");
}

export async function deleteAdminUserAction(id: string) {
  const currentUser = await requireAdminSession();
  await deleteAdminUser(id, currentUser.id ?? "");
  revalidatePath("/admin/usuarios");
}
