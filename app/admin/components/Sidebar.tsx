"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  BiHomeAlt2, BiClipboard, BiBox, BiGroup,
  BiBarChartAlt2, BiCog, BiLinkExternal, BiLogOut,
  BiChevronLeft, BiChevronRight, BiCategory, BiPalette, BiEnvelope, BiImage,
  BiPurchaseTag,
} from "react-icons/bi";

const NAV = [
  { label: "Overview",     href: "/admin",                icon: BiHomeAlt2     },
  { label: "Hero Banner",  href: "/admin/hero",           icon: BiImage        },
  { label: "Orders",       href: "/admin/orders",         icon: BiClipboard    },
  { label: "Products",     href: "/admin/products",       icon: BiBox          },
  { label: "Categories",   href: "/admin/categories",     icon: BiCategory     },
  { label: "Colors",       href: "/admin/colors",         icon: BiPalette      },
  { label: "Promo Codes",  href: "/admin/promo-codes",    icon: BiPurchaseTag  },
  { label: "Customers",    href: "/admin/customers",      icon: BiGroup        },
  { label: "Subscribers",  href: "/admin/subscribers",    icon: BiEnvelope     },
  { label: "Analytics",    href: "/admin/analytics",      icon: BiBarChartAlt2 },
  { label: "Settings",     href: "/admin/settings",       icon: BiCog          },
];

type Props = { collapsed: boolean; onToggle: () => void };

export default function AdminSidebar({ collapsed, onToggle }: Props) {
  const pathname           = usePathname();
  const { admin, logout }  = useAdminAuth();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className={`flex-shrink-0 bg-zinc-950 text-white flex flex-col transition-all duration-300 ${
      collapsed ? "w-16" : "w-60"
    } min-h-screen`}>

      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-zinc-800 px-4 ${
        collapsed ? "justify-center" : "justify-between"
      }`}>
        {!collapsed && (
          <div>
            <svg width="90" height="30" viewBox="0 0 260 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Fenwalk">
              <path d="M28 46 Q58 22 98 34 Q138 46 178 24 L182 32 Q142 54 102 42 Q62 30 28 56 Z" fill="#5a8fa8"/>
              <path d="M22 36 Q52 12 92 24 Q132 36 172 14 L176 22 Q136 44 96 32 Q56 20 22 46 Z" fill="#2a9090"/>
              <text x="22" y="80" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" fontSize="30" fontWeight="400" letterSpacing="0.5" fill="#a0b4c8">fenwalk</text>
            </svg>
            <span className="block text-[9px] font-semibold tracking-widest text-zinc-500 uppercase mt-0.5">Admin</span>
          </div>
        )}
        <button onClick={onToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0">
          {collapsed
            ? <BiChevronRight className="w-5 h-5" />
            : <BiChevronLeft  className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive(href)
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            } ${collapsed ? "justify-center" : ""}`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
            {!collapsed && isActive(href) && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-zinc-800 py-4 px-2 space-y-0.5">
        <Link href="/" target="_blank"
          title={collapsed ? "View Store" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}>
          <BiLinkExternal className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>View Store</span>}
        </Link>

        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-black flex-shrink-0">
              {admin?.name[0] ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{admin?.name}</div>
              <div className="text-[10px] text-zinc-500 truncate">{admin?.role}</div>
            </div>
            <button onClick={logout} title="Sign out"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0">
              <BiLogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={logout} title="Sign out"
            className="w-full flex items-center justify-center py-2.5 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <BiLogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
