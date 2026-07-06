"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchAdminSettings, updateAdminSettings } from "../../lib/api";
import type { ApiStoreSettings } from "../../lib/types";

function formatZar(amount: number) {
  return `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AdminSettingsPage() {
  const { admin, token } = useAdminAuth();
  const [settings, setSettings] = useState<ApiStoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [testTo, setTestTo] = useState("");
  const [testState, setTestState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [testMsg, setTestMsg] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminSettings(token);
      setSettings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!token || !settings) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateAdminSettings({
        storeName: settings.storeName,
        storeEmail: settings.storeEmail,
        usdToZarRate: settings.usdToZarRate,
        freeShippingThresholdUsd: settings.freeShippingThresholdUsd,
        standardShippingFeeUsd: settings.standardShippingFeeUsd,
        newOrderAlerts: settings.newOrderAlerts,
        lowStockWarnings: settings.lowStockWarnings,
        customerReviews: settings.customerReviews,
        dailyRevenueSummary: settings.dailyRevenueSummary,
      }, token);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    if (!token) return;
    const to = testTo.trim() || admin?.email || "";
    if (!to) return;
    setTestState("sending");
    setTestMsg("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://monkfish-app-jcnhk.ondigitalocean.app/api";
      const res = await fetch(`${apiUrl}/admin/test-email?to=${encodeURIComponent(to)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setTestState("ok");
        setTestMsg(json.message ?? `Sent to ${to}`);
      } else {
        setTestState("error");
        setTestMsg(json.message ?? "SMTP error");
      }
    } catch (e) {
      setTestState("error");
      setTestMsg(e instanceof Error ? e.message : "Network error");
    }
  };

  const update = <K extends keyof ApiStoreSettings>(key: K, value: ApiStoreSettings[K]) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      if (key === "usdToZarRate" || key === "freeShippingThresholdUsd") {
        next.freeShippingThresholdZar = Math.round(next.freeShippingThresholdUsd * next.usdToZarRate * 100) / 100;
      }
      if (key === "usdToZarRate" || key === "standardShippingFeeUsd") {
        next.standardShippingFeeZar = Math.round(next.standardShippingFeeUsd * next.usdToZarRate * 100) / 100;
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl flex items-center justify-center py-20">
        <p className="text-sm text-zinc-400">Loading settings…</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-sm text-red-500">{error || "Settings unavailable."}</p>
        <button onClick={load} className="text-sm font-semibold text-zinc-900 underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Profile */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-4">
        <h3 className="font-black text-zinc-900">Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 text-white text-2xl font-black flex items-center justify-center">
            {admin?.name[0] ?? "A"}
          </div>
          <div>
            <p className="font-bold text-zinc-900">{admin?.name}</p>
            <p className="text-sm text-zinc-400">{admin?.role}</p>
            <p className="text-xs text-zinc-400">{admin?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Display Name</label>
            <input value={admin?.name ?? ""} readOnly
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-zinc-50 text-zinc-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Email</label>
            <input value={admin?.email ?? ""} readOnly
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-zinc-50 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Store settings */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-4">
        <h3 className="font-black text-zinc-900">Store Settings</h3>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Store Name</label>
          <input value={settings.storeName}
            onChange={(e) => update("storeName", e.target.value)}
            className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Store Email</label>
          <input type="email" value={settings.storeEmail}
            onChange={(e) => update("storeEmail", e.target.value)}
            className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Currency</label>
            <input value={`${settings.displayCurrency} (R)`} readOnly
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-zinc-50 text-zinc-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">USD → ZAR Rate</label>
            <input type="number" step="0.01" min="0" value={settings.usdToZarRate}
              onChange={(e) => update("usdToZarRate", parseFloat(e.target.value) || 0)}
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
              Free Shipping Threshold
            </label>
            <input type="number" step="0.01" min="0" value={settings.freeShippingThresholdUsd}
              onChange={(e) => update("freeShippingThresholdUsd", parseFloat(e.target.value) || 0)}
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors" />
            <p className="text-xs text-zinc-400 mt-1">
              = {formatZar(settings.freeShippingThresholdZar)} (shown to customers)
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
              Standard Shipping Fee (ZAR)
            </label>
            <input type="number" step="0.01" min="0" value={settings.standardShippingFeeUsd}
              onChange={(e) => update("standardShippingFeeUsd", parseFloat(e.target.value) || 0)}
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors" />
            <p className="text-xs text-zinc-400 mt-1">
              = {formatZar(settings.standardShippingFeeZar)} (shown to customers)
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6">
        <h3 className="font-black text-zinc-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          {([
            { key: "newOrderAlerts" as const,      label: "New order alerts",      desc: "Notify when a new order is placed" },
            { key: "lowStockWarnings" as const,    label: "Low stock warnings",    desc: "Alert when product stock is low" },
            { key: "customerReviews" as const,     label: "Customer reviews",      desc: "Notify when a customer posts a review" },
            { key: "dailyRevenueSummary" as const, label: "Daily revenue summary", desc: "Daily email with revenue stats" },
          ]).map((n) => {
            const on = settings[n.key];
            return (
              <div key={n.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{n.label}</p>
                  <p className="text-xs text-zinc-400">{n.desc}</p>
                </div>
                <button type="button" onClick={() => update(n.key, !on)}
                  className={`w-10 h-6 rounded-full relative transition-colors ${on ? "bg-zinc-900" : "bg-zinc-200"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${on ? "right-1" : "left-1"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SMTP test */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="font-black text-zinc-900">Email / SMTP Test</h3>
          <p className="text-xs text-zinc-400 mt-1">Send a test email to verify your SMTP settings are working on the server.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder={admin?.email ?? "test@example.com"}
            value={testTo}
            onChange={(e) => { setTestTo(e.target.value); setTestState("idle"); }}
            className="flex-1 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors"
          />
          <button
            onClick={sendTestEmail}
            disabled={testState === "sending"}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {testState === "sending" ? "Sending…" : "Send Test"}
          </button>
        </div>
        {testState === "ok" && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {testMsg}
          </div>
        )}
        {testState === "error" && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1">
            <p className="font-semibold">SMTP failed, email settings are not configured on the server.</p>
            <p className="font-mono text-xs break-all">{testMsg}</p>
            <p className="text-xs text-red-500 mt-2">
              Add the <span className="font-mono">EmailSettings__*</span> environment variables in your DigitalOcean App settings and redeploy.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-50 ${
            saved ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"
          }`}>
          {saved ? "✓ Saved" : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
