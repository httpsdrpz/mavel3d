import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminUser } from "@/lib/types";

/**
 * Admin-user management. Auth identity (email + hashed password) lives in
 * Supabase Auth (auth.users, via the GoTrue admin API); `admin_users` only
 * carries the profile/role bit that gates /admin. Service-role only — never
 * imported from a Server Component or Client Component directly, only from
 * Server Actions gated by `requireAdminSession()`.
 */

interface AdminProfileRow {
  id: string;
  name: string;
  role: "ADMIN";
  active: boolean;
  created_at: string;
}

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
}

/** Used by the login page (unauthenticated) to decide whether to show "Criar Conta de Administrador". */
export async function hasAnyAdmin(): Promise<boolean> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("admin_users")
    .select("id", { count: "exact", head: true })
    .eq("role", "ADMIN");

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const supabase = createAdminClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("admin_users")
    .select("id, name, role, active, created_at")
    .order("created_at", { ascending: true });
  if (profilesError) throw new Error(profilesError.message);

  const { data: authList, error: authError } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });
  if (authError) throw new Error(authError.message);

  const authById = new Map(authList.users.map((u) => [u.id, u]));

  return (profiles as AdminProfileRow[]).map((profile) => {
    const authUser = authById.get(profile.id);
    return {
      id: profile.id,
      name: profile.name,
      email: authUser?.email ?? "",
      role: profile.role,
      active: profile.active,
      createdAt: profile.created_at,
      lastSignInAt: authUser?.last_sign_in_at ?? null,
    };
  });
}

export async function createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name: input.name },
  });
  if (error || !data.user) throw new Error(error?.message ?? "Não foi possível criar o usuário.");

  const { error: profileError } = await supabase
    .from("admin_users")
    .insert({ id: data.user.id, name: input.name, role: "ADMIN", active: true });
  if (profileError) {
    await supabase.auth.admin.deleteUser(data.user.id);
    throw new Error(profileError.message);
  }

  return {
    id: data.user.id,
    name: input.name,
    email: data.user.email ?? input.email,
    role: "ADMIN",
    active: true,
    createdAt: data.user.created_at,
    lastSignInAt: null,
  };
}

export async function updateAdminProfile(
  id: string,
  input: { name: string; email: string }
): Promise<void> {
  const supabase = createAdminClient();

  const { error: authError } = await supabase.auth.admin.updateUserById(id, {
    email: input.email,
    user_metadata: { name: input.name },
  });
  if (authError) throw new Error(authError.message);

  const { error } = await supabase.from("admin_users").update({ name: input.name }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function resetAdminPassword(id: string, password: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(id, { password });
  if (error) throw new Error(error.message);
}

export async function setAdminActive(id: string, active: boolean): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("admin_users").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteAdminUser(id: string, currentUserId: string): Promise<void> {
  if (id === currentUserId) {
    throw new Error("Você não pode excluir a própria conta.");
  }
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
}
