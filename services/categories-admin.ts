import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductCategory } from "@/lib/types";

import { CATEGORY_COLUMNS, mapRowToCategory, type CategoryRow } from "./categories-shared";

export type CategoryInput = Omit<ProductCategory, "id">;

/**
 * Admin-only category writes. Service-role key (bypasses RLS), only ever
 * imported from a Server Action gated by `requireAdminSession()`.
 */
export async function createCategory(input: CategoryInput): Promise<ProductCategory> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      icon: input.icon,
      color: input.color,
      description: input.description ?? "",
    })
    .select(CATEGORY_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return mapRowToCategory(data as CategoryRow);
}

export async function updateCategory(id: string, input: CategoryInput): Promise<ProductCategory> {
  const supabase = createAdminClient();

  const { data: existing, error: existingError } = await supabase
    .from("categories")
    .select("name")
    .eq("id", id)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: input.name,
      icon: input.icon,
      color: input.color,
      description: input.description ?? "",
    })
    .eq("id", id)
    .select(CATEGORY_COLUMNS)
    .single();

  if (error) throw new Error(error.message);

  // Keep real products in sync with a rename — the category name is the
  // only link between the two tables (`products.category` is free text).
  if (existing && existing.name !== input.name) {
    const { error: renameError } = await supabase
      .from("products")
      .update({ category: input.name })
      .eq("category", existing.name);
    if (renameError) throw new Error(renameError.message);
  }

  return mapRowToCategory(data as CategoryRow);
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
