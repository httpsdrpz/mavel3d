import { getItem, setItem } from "./storage";
import { products as seedProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import { slugify } from "@/lib/utils";

const KEY = "marvel-products";

/**
 * Fills in defaults for any fields missing from records saved by an older
 * version of the Product schema (localStorage persists across app updates).
 */
function normalizeProduct(raw: Partial<Product>): Product {
  const name = raw.name ?? "Produto sem nome";
  const price = raw.price ?? 0;
  const id = raw.id ?? slugify(name) ?? "produto";
  return {
    id,
    name,
    slug: raw.slug ?? slugify(name) ?? id,
    shortDescription: raw.shortDescription ?? raw.description?.split(". ")[0] ?? "",
    description: raw.description ?? "",
    category: raw.category ?? "",
    price,
    compareAtPrice: raw.compareAtPrice,
    cost: raw.cost ?? Math.round(price * 0.55 * 100) / 100,
    stock: raw.stock ?? 0,
    sku: raw.sku ?? `SKU-${id.toUpperCase()}`,
    barcode: raw.barcode,
    images: raw.images ?? [],
    featured: raw.featured ?? false,
    isNew: raw.isNew ?? false,
    isPromotion: raw.isPromotion ?? Boolean(raw.compareAtPrice),
    active: raw.active ?? true,
    metaTitle: raw.metaTitle,
    metaDescription: raw.metaDescription,
    rating: raw.rating ?? 5,
    createdAt: raw.createdAt ?? new Date().toISOString().slice(0, 10),
  };
}

export function getProducts(): Product[] {
  const stored = getItem<Partial<Product>[] | null>(KEY, null);
  if (!stored) return seedProducts;
  return stored.map(normalizeProduct);
}

export function saveProducts(products: Product[]) {
  setItem(KEY, products);
}
