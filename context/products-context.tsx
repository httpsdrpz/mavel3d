"use client";

import * as React from "react";

import { getActiveProducts } from "@/services/products";
import type { Product } from "@/lib/types";

interface ProductsContextValue {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  /**
   * Renames a category in the in-memory product list only, so the products
   * admin table reflects a rename immediately. The actual `products.category`
   * column is updated server-side by services/categories-admin.ts — this is
   * just optimistic local sync, since ProductsContext doesn't refetch.
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
