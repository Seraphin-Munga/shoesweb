"use client";

import { CartProvider }      from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { AuthProvider }      from "../context/AuthContext";
import { ReviewsProvider }   from "../context/ReviewsContext";
import CookieBanner          from "./CookieBanner";
import FirstVisitPopup       from "./FirstVisitPopup";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <ReviewsProvider>
            {children}
            <CookieBanner />
            <FirstVisitPopup />
          </ReviewsProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
