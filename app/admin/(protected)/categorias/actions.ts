"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/supabase/admin";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type CategoryInput,
} from "@/services/categories-admin";
import type { ProductCategory } from "@/lib/types";

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/produtos");
}

export async function createCategoryAction(input: CategoryInput): Promise<ProductCategory> {
  await requireAdminSession();
  const category = await createCategory(input);
  revalidateStorefront();
  return category;
}

export async function updateCategoryAction(
  id: string,
  input: CategoryInput
): Promise<ProductCategory> {
  await requireAdminSession();
  const category = await updateCategory(id, input);
  revalidateStorefront();
  return category;
}

export async function deleteCategoryAction(id: string): Promise<void> {
  await requireAdminSession();
  await deleteCategory(id);
  revalidateStorefront();
}
