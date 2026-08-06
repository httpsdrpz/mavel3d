import type { ProductCategory } from "@/lib/types";

/** Shape of a row in the Postgres `categories` table (snake_case). */
export interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const CATEGORY_COLUMNS = "id, name, icon, color, description";

export function mapRowToCategory(row: CategoryRow): ProductCategory {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    description: row.description || undefined,
  };
}
