import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/lib/types";

import { PRODUCT_COLUMNS, mapRowToProduct, type ProductRow } from "./products-shared";

/**
 * Public product reads. Safe to call from Server Components, Server Actions,
 * or Client Components — RLS restricts the anon key to `active = true` rows
 * regardless of caller. This is the only file the storefront (home,
 * /produtos, /produto/[id]) talks to the database through.
 */

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(mapRowToProduct);
}

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(mapRowToProduct);
}

export async function getActiveProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRowToProduct(data as ProductRow) : null;
}

export async function getRelatedActiveProducts(
  category: string,
  excludeId: string,
  limit = 4
): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .eq("category", category)
    .neq("id", excludeId)
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(mapRowToProduct);
}
