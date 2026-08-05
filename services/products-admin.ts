import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";
import { slugify } from "@/lib/utils";

import { PRODUCT_COLUMNS, mapInputToRow, mapRowToProduct, type ProductRow } from "./products-shared";

const IMAGE_BUCKET = "product-images";

export type ProductInput = Omit<Product, "id" | "rating" | "createdAt">;

/**
 * Admin-only product reads/writes. Uses the service-role key (bypasses RLS,
 * so it can see inactive products and write), and is only ever imported from
 * Server Actions gated by `requireAdminSession()` — never from a Server
 * Component or Client Component directly.
 */

export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(mapRowToProduct);
}

export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRowToProduct(data as ProductRow) : null;
}

async function uniqueId(base: string, ignoreId?: string): Promise<string> {
  const supabase = createAdminClient();
  const normalized = base || "produto";
  const { data, error } = await supabase.from("products").select("id");
  if (error) throw new Error(error.message);

  const existing = new Set((data as { id: string }[]).map((row) => row.id));
  if (ignoreId) existing.delete(ignoreId);

  let id = normalized;
  let suffix = 1;
  while (existing.has(id)) {
    id = `${normalized}-${suffix++}`;
  }
  return id;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const supabase = createAdminClient();
  const baseId = slugify(input.name) || "produto";
  const id = await uniqueId(slugify(input.slug) || baseId);

  const row = { ...mapInputToRow(input), id, slug: id };

  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select(PRODUCT_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return mapRowToProduct(data as ProductRow);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const supabase = createAdminClient();
  const slug = await uniqueId(slugify(input.slug) || slugify(input.name), id);

  const { data, error } = await supabase
    .from("products")
    .update({ ...mapInputToRow(input), slug })
    .eq("id", id)
    .select(PRODUCT_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return mapRowToProduct(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function duplicateProduct(id: string): Promise<Product> {
  const original = await getProductByIdAdmin(id);
  if (!original) throw new Error("Produto não encontrado.");

  const baseId = slugify(`${original.name}-copia`) || "produto-copia";
  const newId = await uniqueId(baseId);

  const input: ProductInput = {
    name: `${original.name} (cópia)`,
    slug: newId,
    shortDescription: original.shortDescription,
    description: original.description,
    category: original.category,
    price: original.price,
    compareAtPrice: original.compareAtPrice,
    cost: original.cost,
    stock: original.stock,
    sku: original.sku,
    barcode: original.barcode,
    images: original.images,
    featured: false,
    isNew: original.isNew,
    isPromotion: original.isPromotion,
    active: original.active,
    metaTitle: original.metaTitle,
    metaDescription: original.metaDescription,
  };

  const row = { ...mapInputToRow(input), id: newId, slug: newId };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select(PRODUCT_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return mapRowToProduct(data as ProductRow);
}

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(url: string): Promise<void> {
  const marker = `/${IMAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return; // not one of our uploads (e.g. a pasted external URL)

  const path = url.slice(idx + marker.length);
  const supabase = createAdminClient();
  await supabase.storage.from(IMAGE_BUCKET).remove([path]);
}
