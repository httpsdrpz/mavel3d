"use client";

import * as React from "react";

import { getActiveProducts } from "@/services/products";
import type { Product } from "@/lib/types";

interface ProductsContextValue {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  /**
   * Renames a category in the in-memory product list only (used by the
   * legacy categorias admin page for its product-count display). It does
   * not persist to Supabase — categories aren't part of this migration, so
   * a rename here doesn't update the `category` column on real products.
   */
  renameCategoryInProducts: (oldName: string, newName: string) => void;
  isReady: boolean;
}

const ProductsContext = React.createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    getActiveProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        // storefront falls back to an empty catalog if Supabase isn't reachable
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getProduct = React.useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const renameCategoryInProducts = React.useCallback((oldName: string, newName: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.category === oldName ? { ...p, category: newName } : p))
    );
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, getProduct, renameCategoryInProducts, isReady }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = React.useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  return ctx;
}
