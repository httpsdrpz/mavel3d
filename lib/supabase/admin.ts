import "server-only";

import { createClient } from "@supabase/supabase-js";

import { auth } from "@/auth";

/**
 * Service-role client. Bypasses RLS entirely, so it must never be reachable
 * from client code — the `server-only` import above makes any accidental
 * client-bundle import a build error instead of a leaked secret.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin não configurado: defina SUPABASE_SERVICE_ROLE_KEY no .env.local"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/**
 * Verifies the NextAuth session. `proxy.ts` only does an optimistic
 * cookie-presence check (per Next.js guidance, Proxy shouldn't do slow/full
 * auth); this is the real check, and every write Server Action calls it
 * directly since actions are reachable via direct POST requests regardless
 * of the UI.
 */
export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("UNAUTHENTICATED");
  }
  return session.user;
}
