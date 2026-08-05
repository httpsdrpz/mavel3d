import { getItem, setItem } from "./storage";
import { categories as seedCategories } from "@/lib/categories";
import type { ProductCategory } from "@/lib/types";

const KEY = "marvel-categories";

export function getCategories(): ProductCategory[] {
  return getItem<ProductCategory[]>(KEY, seedCategories);
}

export function saveCategories(categories: ProductCategory[]) {
  setItem(KEY, categories);
}
