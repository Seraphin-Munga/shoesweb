"use client";

import { CartProvider }      from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { AuthProvider }      from "../context/AuthContext";
import { ReviewsProvider }   from "../context/ReviewsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <ReviewsProvider>
            {children}
          </ReviewsProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
