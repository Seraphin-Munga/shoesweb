"use client";

import { useState, useEffect, useMemo } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  fetchSubscribers, deleteSubscriber, deleteAllSubscribers,
} from "../../lib/api";
import type { ApiSubscriber } from "../../lib/types";

export default function AdminSubscribersPage() {
  const { token }                        = useAdminAuth();
  const [subscribers, setSubscribers]    = useState<ApiSubscriber[]>([]);
  const [loading, setLoading]            = useState(true);
  const [search, setSearch]              = useState("");
  const [deleteId, setDeleteId]          = useState<number | "__all__" | null>(null);
  const [copied, setCopied]              = useState(false);
  const [busy, setBusy]                  = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchSubscribers(token)
      .then(setSubscribers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = useMemo(() =>
    subscribers.filter((s) =>
      s.email.toLowerCase().includes(search.toLowerCase())
    ), [subscribers, search]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    setBusy(true);
    try {
      await deleteSubscriber(id, token);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch {}
    setBusy(false);
    setDeleteId(null);
  };

  const handleDeleteAll = async () => {
    if (!token) return;
    setBusy(true);
    try {
      await deleteAllSubscribers(token);
      setSubscribers([]);
    } catch {}
    setBusy(false);
    setDeleteId(null);
  };

  const exportCSV = () => {
    const rows = ["Email,Subscribed At", ...filtered.map((s) =>
      `${s.email},${new Date(s.subscribedAt).toLocaleString()}`
    )].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "stryde_subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const copyEmails = () => {
    navigator.clipboard.writeText(filtered.map((s) => s.email).join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const thisMonth = subscribers.filter((s) => {
    const d = new Date(s.subscribedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const today = subscribers.filter((s) =>
    new Date(s.subscribedAt).toDateString() === new Date().toDateString()
  ).length;

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-100 rounded-2xl p-5 h-24" />
          ))}
        </div>
        <div className="bg-white border border-zinc-100 rounded-2xl h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Subscribers", value: subscribers.length },
          { label: "This Month",        value: thisMonth },
          { label: "Today",             value: today },
          { label: "Showing",           value: filtered.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-zinc-100 rounded-2xl p-5">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-zinc-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
          All Subscribers
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email…"
              className="pl-8 pr-3 py-2 text-sm border border-zinc-200 rounded-xl outline-none focus:border-zinc-900 transition-colors w-52"
            />
          </div>

          <button onClick={copyEmails}
            className="flex items-center gap-1.5 text-xs font-semibold border border-zinc-200 bg-white text-zinc-600 px-3 py-2 rounded-xl hover:border-zinc-400 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {copied ? "Copied!" : "Copy Emails"}
          </button>

          <button onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs font-semibold border border-zinc-200 bg-white text-zinc-600 px-3 py-2 rounded-xl hover:border-zinc-400 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      {subscribers.length === 0 ? (
        <div className="bg-white border border-zinc-100 rounded-2xl p-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-zinc-400 text-sm font-medium mb-1">No subscribers yet</p>
          <p className="text-zinc-300 text-xs">Subscribers will appear here when people sign up on the home page.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b border-zinc-50 bg-zinc-50">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Subscribed</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Action</span>
          </div>

          <div className="divide-y divide-zinc-50">
            {filtered.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-zinc-400">
                No results for &ldquo;{search}&rdquo;
              </div>
            ) : (
              filtered.map((s, i) => (
                <div key={s.id}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-zinc-50/50 transition-colors group">

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                      {s.email[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{s.email}</p>
                      <p className="text-[10px] text-zinc-400">#{i + 1}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-medium text-zinc-700">
                      {new Date(s.subscribedAt).toLocaleDateString("en-ZA", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {new Date(s.subscribedAt).toLocaleTimeString("en-ZA", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => setDeleteId(s.id)}
                    className="w-7 h-7 rounded-lg border border-zinc-100 flex items-center justify-center text-zinc-300 hover:text-red-500 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-zinc-50 flex items-center justify-between">
              <p className="text-xs text-zinc-400">
                {filtered.length} of {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
              </p>
              <button onClick={() => setDeleteId("__all__")}
                className="text-xs text-zinc-300 hover:text-red-500 transition-colors">
                Delete all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-black text-zinc-900 mb-1">
              {deleteId === "__all__" ? "Delete all subscribers?" : "Remove subscriber?"}
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              {deleteId === "__all__"
                ? `This will permanently remove all ${subscribers.length} subscribers.`
                : `${subscribers.find((s) => s.id === deleteId)?.email} will be removed.`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={busy}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:border-zinc-400 transition-colors">
                Cancel
              </button>
              <button
                disabled={busy}
                onClick={() =>
                  deleteId === "__all__"
                    ? handleDeleteAll()
                    : handleDelete(deleteId as number)
                }
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60">
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
