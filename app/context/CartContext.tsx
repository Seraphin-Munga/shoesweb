"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type CartProduct = {
  id: number;
  name: string;
  price: number;
  bgColor: string;
  colors: { name: string; hex: string }[];
  imageUrls?: string[];
};

export type CartItem = {
  product: CartProduct;
  size: number;
  color: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: CartProduct, size: number, color: string, qty?: number) => void;
  removeItem: (productId: number, size: number, color: string) => void;
  updateQty: (productId: number, size: number, color: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const KEY = "stryde_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: CartProduct, size: number, color: string, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.product.id === product.id && i.size === size && i.color === color
      );
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { product, size, color, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((productId: number, size: number, color: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.size === size && i.color === color))
    );
  }, []);

  const updateQty = useCallback((productId: number, size: number, color: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size && i.color === color
          ? { ...i, quantity: qty }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count    = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
