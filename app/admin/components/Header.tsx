"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "../context/AdminAuthContext";
import { BiBell, BiChevronDown, BiCheck, BiPackage } from "react-icons/bi";
import { useOrderNotifications, type OrderNotification } from "../hooks/useOrderNotifications";

const PAGE_TITLES: Record<string, string> = {
  "/admin":           "Dashboard",
  "/admin/orders":    "Orders",
  "/admin/products":  "Products",
  "/admin/customers": "Customers",
  "/admin/analytics": "Analytics",
  "/admin/settings":  "Settings",
};

function NotificationPanel({
  notifications,
  unreadCount,
  onDismiss,
  onClearAll,
  onClose,
}: {
  notifications: OrderNotification[];
  unreadCount: number;
  onDismiss: (id: number) => void;
  onClearAll: () => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 top-12 w-96 bg-white border border-zinc-100 rounded-2xl shadow-2xl shadow-zinc-200/60 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-900 text-sm">Order Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-black bg-red-500 text-white rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={onClearAll}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors flex items-center gap-1">
            <BiCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-zinc-50">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <BiPackage className="w-8 h-8 text-zinc-200 mb-2" />
            <p className="text-sm text-zinc-400">No new orders yet</p>
            <p className="text-xs text-zinc-300 mt-1">New orders will appear here in real time</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={`${n.orderId}-${n.createdAt}`}
              className="flex gap-3 px-5 py-4 hover:bg-zinc-50 transition-colors group">

              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BiPackage className="w-4.5 h-4.5 text-green-600" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-zinc-900 leading-snug">
                    Order #{n.orderId}
                  </p>
                  <button onClick={() => onDismiss(n.orderId)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-300 hover:text-zinc-500 flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-zinc-500 truncate">{n.customerName} · {n.customerEmail}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm font-black text-zinc-900">{n.totalFormatted}</span>
                  <span className="text-[10px] text-zinc-400">·</span>
                  <span className="text-xs text-zinc-400">{n.itemCount} item{n.itemCount !== 1 ? "s" : ""}</span>
                  <span className="text-[10px] text-zinc-400">·</span>
                  <span className="text-xs text-zinc-400">📍 {n.shippingCountry}</span>
                </div>
                <p className="text-[10px] text-zinc-300 mt-1">
                  {new Date(n.createdAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-100 px-5 py-3">
        <button onClick={onClose}
          className="w-full text-center text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
          View all orders →
        </button>
      </div>
    </div>
  );
}

export default function AdminHeader() {
  const pathname  = usePathname();
  const { admin } = useAdminAuth();
  const title     = PAGE_TITLES[pathname] ?? "Dashboard";

  const { notifications, unreadCount, connected, clearNotifications, dismissOne } =
    useOrderNotifications();

  const [showNotifications, setShowNotifications] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setShowNotifications(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-8 flex-shrink-0">
      <div>
        <h1 className="text-lg font-black text-zinc-900">{title}</h1>
        <p className="text-[11px] text-zinc-400 leading-none mt-0.5">
          {new Date().toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex items-center gap-3">

        {/* Notification bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors"
            aria-label="Notifications"
          >
            <BiBell className="w-5 h-5" />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black px-1 animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}

            {/* Connection dot */}
            <span className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ${connected ? "bg-green-400" : "bg-zinc-300"}`} />
          </button>

          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onDismiss={dismissOne}
              onClearAll={clearNotifications}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

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
