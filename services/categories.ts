import { createPublicClient } from "@/lib/supabase/public";
import type { ProductCategory } from "@/lib/types";

import { CATEGORY_COLUMNS, mapRowToCategory, type CategoryRow } from "./categories-shared";

/**
 * Public categories read. Safe to call from Server Components, Server
 * Actions, or Client Components (mirrors services/products.ts) — RLS lets
 * `anon` select every row, no writes are possible with this client.
 */
export async function getCategories(): Promise<ProductCategory[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as CategoryRow[]).map(mapRowToCategory);
}
