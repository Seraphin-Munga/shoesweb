"use client";

import { usePathname } from "next/navigation";
import { useAdminAuth } from "../context/AdminAuthContext";
import { BiBell, BiChevronDown } from "react-icons/bi";

const PAGE_TITLES: Record<string, string> = {
  "/admin":           "Dashboard",
  "/admin/orders":    "Orders",
  "/admin/products":  "Products",
  "/admin/customers": "Customers",
  "/admin/analytics": "Analytics",
  "/admin/settings":  "Settings",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const { admin } = useAdminAuth();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-8 flex-shrink-0">
      <div>
        <h1 className="text-lg font-black text-zinc-900">{title}</h1>
        <p className="text-[11px] text-zinc-400 leading-none mt-0.5">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors">
          <BiBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-px h-6 bg-zinc-100" />

        {/* Admin badge */}
        <button className="flex items-center gap-2.5 hover:bg-zinc-50 rounded-xl px-2 py-1.5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-black">
            {admin?.name[0] ?? "A"}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-zinc-900 leading-tight">{admin?.name}</div>
            <div className="text-[10px] text-zinc-400">{admin?.role}</div>
          </div>
          <BiChevronDown className="w-4 h-4 text-zinc-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
