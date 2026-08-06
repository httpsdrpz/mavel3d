"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/(protected)/categorias/actions";
import { getCategories } from "@/services/categories";
import type { ProductCategory } from "@/lib/types";
import { useProducts } from "./products-context";

export type CategoryInput = Omit<ProductCategory, "id">;

interface CategoriesContextValue {
  categories: ProductCategory[];
  addCategory: (input: CategoryInput) => Promise<void>;
  updateCategory: (id: string, input: CategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  isReady: boolean;
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(null);

function byName(a: ProductCategory, b: ProductCategory) {
  return a.name.localeCompare(b.name);
}

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const { renameCategoryInProducts } = useProducts();
  const [categories, setCategories] = React.useState<ProductCategory[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        // storefront/admin fall back to an empty list if Supabase isn't reachable
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addCategory = React.useCallback(async (input: CategoryInput) => {
    try {
      const created = await createCategoryAction(input);
      setCategories((prev) => [...prev, created].sort(byName));
      toast.success("Categoria criada com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar a categoria");
      throw error;
    }
  }, []);

  const updateCategory = React.useCallback(
    async (id: string, input: CategoryInput) => {
      const existing = categories.find((c) => c.id === id);
      try {
        const updated = await updateCategoryAction(id, input);
        setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)).sort(byName));
        if (existing && existing.name !== input.name) {
          renameCategoryInProducts(existing.name, input.name);
        }
        toast.success("Categoria atualizada com sucesso");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Não foi possível atualizar a categoria"
        );
        throw error;
      }
    },
    [categories, renameCategoryInProducts]
  );

  const deleteCategory = React.useCallback(async (id: string) => {
    try {
      await deleteCategoryAction(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Categoria excluída");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir a categoria");
      throw error;
    }
  }, []);

  return (
    <CategoriesContext.Provider
      value={{ categories, addCategory, updateCategory, deleteCategory, isReady }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = React.useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories deve ser usado dentro de CategoriesProvider");
  return ctx;
}
