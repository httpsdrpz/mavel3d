"use client";

import * as React from "react";
import { toast } from "sonner";

import { products as initialProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

const STORAGE_KEY = "marvel-products";

export type ProductInput = Omit<Product, "id" | "rating" | "createdAt">;

interface ProductsContextValue {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  addProduct: (input: ProductInput) => void;
  updateProduct: (id: string, input: ProductInput) => void;
  deleteProduct: (id: string) => void;
  isReady: boolean;
}

const ProductsContext = React.createContext<ProductsContextValue | null>(null);

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from a browser-only store; must run after mount to avoid an SSR mismatch
      if (raw) setProducts(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setIsReady(true);
    }
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, isReady]);

  const getProduct = React.useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const addProduct = React.useCallback((input: ProductInput) => {
    setProducts((prev) => {
      const baseId = slugify(input.name) || "produto";
      let id = baseId;
      let suffix = 1;
      while (prev.some((p) => p.id === id)) {
        id = `${baseId}-${suffix++}`;
      }
      const newProduct: Product = {
        ...input,
        id,
        rating: 5,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      return [newProduct, ...prev];
    });
    toast.success("Produto adicionado com sucesso");
  }, []);

  const updateProduct = React.useCallback((id: string, input: ProductInput) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...input } : p))
    );
    toast.success("Produto atualizado com sucesso");
  }, []);

  const deleteProduct = React.useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Produto excluído");
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, getProduct, addProduct, updateProduct, deleteProduct, isReady }}
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
