"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart }      from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth }      from "../context/AuthContext";
import SearchModal      from "./SearchModal";

const links = [
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Men",          href: "/products?gender=Men" },
  { label: "Women",        href: "/products?gender=Women" },
  { label: "All Products", href: "/products" },
  { label: "Sale",         href: "/products?sale=true" },
];

export default function Navbar() {
  const [open, setOpen]           = useState(false);
  const [searchOpen, setSearch]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const { count: cartCount }      = useCart();
  const { count: favCount }       = useFavorites();
  const { user }                  = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const initials = user
    ? (`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase().trim() || user.email?.[0]?.toUpperCase() || "?")
    : null;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-sm" : "bg-white"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center group opacity-90 hover:opacity-100 transition-opacity">
          <svg width="130" height="44" viewBox="0 0 260 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Fenwalk">
            {/* Lower wave — silver-blue */}
            <path d="M28 46 Q58 22 98 34 Q138 46 178 24 L182 32 Q142 54 102 42 Q62 30 28 56 Z" fill="#8fb3c8"/>
            {/* Upper wave — dark teal */}
            <path d="M22 36 Q52 12 92 24 Q132 36 172 14 L176 22 Q136 44 96 32 Q56 20 22 46 Z" fill="#1d6b6a"/>
            {/* Wordmark */}
            <text x="22" y="80" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" fontSize="30" fontWeight="400" letterSpacing="0.5" fill="#354266">fenwalk</text>
          </svg>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.label} href={l.href}
              className="nav-link text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-1">

          {/* Search */}
          <button aria-label="Search" onClick={() => setSearch(true)}
            className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Favorites */}
          <Link href="/favorites" aria-label="Favorites"
            className="relative hidden sm:flex p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {favCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
                {favCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" aria-label="Cart"
            className="relative p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-zinc-900 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link href="/account" aria-label="Account"
            className="relative p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-50">
            {initials ? (
              <span className="flex w-7 h-7 rounded-full bg-zinc-900 text-white text-[10px] font-black items-center justify-center">
                {initials}
              </span>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button aria-label="Menu" className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
            onClick={() => setOpen(!open)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-zinc-100 ${
        open ? "max-h-80" : "max-h-0"}`}>
        <nav className="px-6 py-5 flex flex-col gap-1">
          {/* Mobile search */}
          <button onClick={() => { setOpen(false); setSearch(true); }}
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2 border-b border-zinc-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2 border-b border-zinc-50 last:border-0">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-4 pt-3">
            <Link href="/favorites" onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favorites {favCount > 0 && `(${favCount})`}
            </Link>
            <Link href="/account" onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {user ? `${user.firstName}` : "Account"}
            </Link>
          </div>
        </nav>
      </div>

      {/* Search modal */}
      {searchOpen && <SearchModal onClose={() => setSearch(false)} />}
    </header>
  );
}
