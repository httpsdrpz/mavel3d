"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/supabase/admin";
import {
  createProduct,
  deleteProduct,
  duplicateProduct,
  updateProduct,
  uploadProductImage,
  type ProductInput,
} from "@/services/products-admin";
import type { Product } from "@/lib/types";

function revalidateStorefront(id?: string) {
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin/produtos");
  if (id) revalidatePath(`/produto/${id}`);
}

export async function createProductAction(input: ProductInput): Promise<Product> {
  await requireAdminSession();
  const product = await createProduct(input);
  revalidateStorefront(product.id);
  return product;
}

export async function updateProductAction(id: string, input: ProductInput): Promise<Product> {
  await requireAdminSession();
  const product = await updateProduct(id, input);
  revalidateStorefront(id);
  if (product.id !== id) revalidateStorefront(product.id);
  return product;
}

export async function deleteProductAction(id: string): Promise<void> {
  await requireAdminSession();
  await deleteProduct(id);
  revalidateStorefront(id);
}

export async function duplicateProductAction(id: string): Promise<Product> {
  await requireAdminSession();
  const product = await duplicateProduct(id);
  revalidateStorefront(product.id);
  return product;
}

export async function uploadProductImageAction(file: File): Promise<string> {
  await requireAdminSession();
  return uploadProductImage(file);
}
