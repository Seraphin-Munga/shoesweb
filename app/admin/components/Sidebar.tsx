"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  BiHomeAlt2, BiClipboardData, BiBox, BiGroup,
  BiBarChartAlt2, BiCog, BiLinkExternal, BiLogOut,
  BiChevronLeft, BiChevronRight,
} from "react-icons/bi";

const NAV = [
  { label: "Overview",   href: "/admin",            icon: BiHomeAlt2       },
  { label: "Orders",     href: "/admin/orders",     icon: BiClipboardData  },
  { label: "Products",   href: "/admin/products",   icon: BiBox            },
  { label: "Customers",  href: "/admin/customers",  icon: BiGroup          },
  { label: "Analytics",  href: "/admin/analytics",  icon: BiBarChartAlt2   },
  { label: "Settings",   href: "/admin/settings",   icon: BiCog            },
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
            <span className="text-base font-black tracking-[0.15em] text-white">STRYDE</span>
            <span className="block text-[9px] font-semibold tracking-widest text-zinc-500 uppercase">Admin</span>
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
