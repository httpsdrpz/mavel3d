"use client";

import * as React from "react";
import { toast } from "sonner";

import { products as seedProducts } from "@/lib/products";
import { getProducts, saveProducts } from "@/services/products.service";
import type { Product } from "@/lib/types";
import { slugify } from "@/lib/utils";

export type ProductInput = Omit<Product, "id" | "rating" | "createdAt">;

interface ProductsContextValue {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  addProduct: (input: ProductInput) => void;
  updateProduct: (id: string, input: ProductInput) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  renameCategoryInProducts: (oldName: string, newName: string) => void;
  isReady: boolean;
}

const ProductsContext = React.createContext<ProductsContextValue | null>(null);

function uniqueSlug(base: string, existing: Product[], ignoreId?: string) {
  const normalized = base || "produto";
  let slug = normalized;
  let suffix = 1;
  while (existing.some((p) => p.slug === slug && p.id !== ignoreId)) {
    slug = `${normalized}-${suffix++}`;
  }
  return slug;
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>(seedProducts);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from a browser-only store; must run after mount to avoid an SSR mismatch
    setProducts(getProducts());
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    saveProducts(products);
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
        slug: uniqueSlug(slugify(input.slug) || baseId, prev),
        rating: 5,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      return [newProduct, ...prev];
    });
    toast.success("Produto adicionado com sucesso");
  }, []);

  const updateProduct = React.useCallback((id: string, input: ProductInput) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...input,
              slug: uniqueSlug(slugify(input.slug) || slugify(input.name), prev, id),
            }
          : p
      )
    );
    toast.success("Produto atualizado com sucesso");
  }, []);

  const deleteProduct = React.useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Produto excluído");
  }, []);

  const duplicateProduct = React.useCallback((id: string) => {
    setProducts((prev) => {
      const original = prev.find((p) => p.id === id);
      if (!original) return prev;
      const baseId = slugify(`${original.name}-copia`) || "produto-copia";
      let newId = baseId;
      let suffix = 1;
      while (prev.some((p) => p.id === newId)) {
        newId = `${baseId}-${suffix++}`;
      }
      const copy: Product = {
        ...original,
        id: newId,
        name: `${original.name} (cópia)`,
        slug: uniqueSlug(newId, prev),
        featured: false,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      return [copy, ...prev];
    });
    toast.success("Produto duplicado");
  }, []);

  const renameCategoryInProducts = React.useCallback((oldName: string, newName: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.category === oldName ? { ...p, category: newName } : p))
    );
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        renameCategoryInProducts,
        isReady,
      }}
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
