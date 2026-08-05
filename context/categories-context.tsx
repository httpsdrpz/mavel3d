"use client";

import * as React from "react";
import { toast } from "sonner";

import { categories as seedCategories } from "@/lib/categories";
import { getCategories, saveCategories } from "@/services/categories.service";
import type { ProductCategory } from "@/lib/types";
import { useProducts } from "./products-context";

export type CategoryInput = Omit<ProductCategory, "id">;

interface CategoriesContextValue {
  categories: ProductCategory[];
  addCategory: (input: CategoryInput) => void;
  updateCategory: (id: string, input: CategoryInput) => void;
  deleteCategory: (id: string) => void;
  isReady: boolean;
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const { renameCategoryInProducts } = useProducts();
  const [categories, setCategories] = React.useState<ProductCategory[]>(seedCategories);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from a browser-only store; must run after mount to avoid an SSR mismatch
    setCategories(getCategories());
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    saveCategories(categories);
  }, [categories, isReady]);

  const addCategory = React.useCallback((input: CategoryInput) => {
    setCategories((prev) => [...prev, { ...input, id: `cat-${Date.now()}` }]);
    toast.success("Categoria criada com sucesso");
  }, []);

  const updateCategory = React.useCallback(
    (id: string, input: CategoryInput) => {
      setCategories((prev) => {
        const existing = prev.find((c) => c.id === id);
        if (existing && existing.name !== input.name) {
          renameCategoryInProducts(existing.name, input.name);
        }
        return prev.map((c) => (c.id === id ? { ...c, ...input } : c));
      });
      toast.success("Categoria atualizada com sucesso");
    },
    [renameCategoryInProducts]
  );

  const deleteCategory = React.useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Categoria excluída");
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
