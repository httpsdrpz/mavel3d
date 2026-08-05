import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | undefined;

/**
 * Anon-key client. Safe to call from Server Components, Server Actions, or
 * Client Components — it never touches cookies or the service role key, and
 * RLS restricts it to public data (e.g. active products) regardless of where
 * it runs. Memoized as a singleton so client components calling this on
 * every render/effect don't spin up a new GoTrueClient each time.
 */
export function createPublicClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local"
    );
  }

  cachedClient = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return cachedClient;
}
