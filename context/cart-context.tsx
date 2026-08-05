"use client";

import * as React from "react";
import { toast } from "sonner";

import { useProducts } from "@/context/products-context";
import { useSettings } from "@/context/settings-context";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "marvel-cart";
const FREE_SHIPPING_THRESHOLD = 500;

export interface CartLine extends CartItem {
  product: Product;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shipping: number;
  total: number;
  count: number;
  isReady: boolean;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { getProduct } = useProducts();
  const { settings } = useSettings();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from a browser-only store; must run after mount to avoid an SSR mismatch
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setIsReady(true);
    }
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  const addToCart = React.useCallback(
    (productId: string, quantity = 1) => {
      const product = getProduct(productId);
      setItems((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { productId, quantity }];
      });
      toast.success(product ? `${product.name} adicionado ao carrinho` : "Adicionado ao carrinho");
    },
    [getProduct]
  );

  const removeFromCart = React.useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = React.useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.productId !== productId);
      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const lines = React.useMemo<CartLine[]>(() => {
    return items
      .map((item) => {
        const product = getProduct(item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter((line): line is CartLine => line !== null);
  }, [items, getProduct]);

  const subtotal = React.useMemo(
    () => lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [lines]
  );

  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : settings.defaultShippingRate;
  const total = subtotal + shipping;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        lines,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        total,
        count,
        isReady,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
