import type { Product } from "@/lib/types";

/** Shape of a row in the Postgres `products` table (snake_case). */
export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  cost: number;
  stock: number;
  sku: string;
  barcode: string | null;
  images: string[];
  featured: boolean;
  is_new: boolean;
  is_promotion: boolean;
  active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  rating: number;
  created_at: string;
}

export const PRODUCT_COLUMNS =
  "id, name, slug, short_description, description, category, price, compare_at_price, cost, stock, sku, barcode, images, featured, is_new, is_promotion, active, meta_title, meta_description, rating, created_at";

export function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    cost: row.cost,
    stock: row.stock,
    sku: row.sku,
    barcode: row.barcode ?? undefined,
    images: row.images,
    featured: row.featured,
    isNew: row.is_new,
    isPromotion: row.is_promotion,
    active: row.active,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    rating: row.rating,
    createdAt: row.created_at.slice(0, 10),
  };
}

/** Maps a `ProductInput` (camelCase, no id/rating/createdAt) to insert/update columns. */
export function mapInputToRow(input: Omit<Product, "id" | "rating" | "createdAt">) {
  return {
    name: input.name,
    slug: input.slug,
    short_description: input.shortDescription,
    description: input.description,
    category: input.category,
    price: input.price,
    compare_at_price: input.compareAtPrice ?? null,
    cost: input.cost,
    stock: input.stock,
    sku: input.sku,
    barcode: input.barcode ?? null,
    images: input.images,
    featured: input.featured,
    is_new: input.isNew,
    is_promotion: input.isPromotion,
    active: input.active,
    meta_title: input.metaTitle ?? null,
    meta_description: input.metaDescription ?? null,
  };
}
