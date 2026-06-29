"use client";

import { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminSettingsPage() {
  const { admin } = useAdminAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl space-y-5">

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
          {["Display Name", "Email"].map((l) => (
            <div key={l}>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">{l}</label>
              <input defaultValue={l === "Email" ? admin?.email : admin?.name}
                className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors bg-zinc-50" />
            </div>
          ))}
        </div>
      </div>

      {/* Store settings */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 space-y-4">
        <h3 className="font-black text-zinc-900">Store Settings</h3>
        {[
          { label: "Store Name", val: "STRYDE Premium Footwear" },
          { label: "Store Email", val: "hello@stryde.com" },
          { label: "Currency", val: "USD ($)" },
          { label: "Shipping Threshold", val: "150" },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">{f.label}</label>
            <input defaultValue={f.val}
              className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-zinc-400 transition-colors" />
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6">
        <h3 className="font-black text-zinc-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          {[
            { label: "New order alerts",        desc: "Notify when a new order is placed",   on: true },
            { label: "Low stock warnings",      desc: "Alert when product stock is low",      on: true },
            { label: "Customer reviews",        desc: "Notify when a customer posts a review", on: false },
            { label: "Daily revenue summary",   desc: "Daily email with revenue stats",       on: true },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-900">{n.label}</p>
                <p className="text-xs text-zinc-400">{n.desc}</p>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${n.on ? "bg-zinc-900" : "bg-zinc-200"}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${n.on ? "right-1" : "left-1"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            saved ? "bg-green-500 text-white" : "bg-zinc-900 text-white hover:bg-zinc-700"
          }`}>
          {saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
