"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type FavoritesContextValue = {
  ids: number[];
  count: number;
  toggle: (id: number) => void;
  isFav: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const KEY = "stryde_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds]           = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids, hydrated]);

  const toggle = useCallback((id: number) => {
    setIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  const isFav = useCallback((id: number) => ids.includes(id), [ids]);

  return (
    <FavoritesContext.Provider value={{ ids, count: ids.length, toggle, isFav }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
