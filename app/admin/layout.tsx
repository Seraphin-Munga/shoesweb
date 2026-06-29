"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import AdminSidebar from "./components/Sidebar";
import AdminHeader  from "./components/Header";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!admin && !isLoginPage) router.replace("/admin/login");
    if (admin  &&  isLoginPage) router.replace("/admin");
  }, [admin, loading, isLoginPage, router]);

  /* Loading spinner */
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-zinc-500 text-sm">Loading STRYDE Admin…</span>
        </div>
      </div>
    );
  }

  /* Login page — no sidebar */
  if (isLoginPage) return <>{children}</>;

  /* Not authed yet — render nothing while redirect fires */
  if (!admin) return null;

  /* Authenticated admin shell */
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
