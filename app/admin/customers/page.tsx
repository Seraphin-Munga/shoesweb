"use client";

const CUSTOMERS = [
  { name: "James Rodriguez",  email: "james.r@email.com",   country: "US", orders: 3, spent: 569.97,  joined: "2026-01-14" },
  { name: "Sarah Chen",       email: "sarah.c@email.com",   country: "CA", orders: 2, spent: 459.98,  joined: "2026-02-03" },
  { name: "Marcus Thompson",  email: "marcus.t@email.com",  country: "UK", orders: 1, spent: 244.00,  joined: "2026-03-11" },
  { name: "Aisha Kowalski",   email: "aisha.k@email.com",   country: "DE", orders: 4, spent: 749.96,  joined: "2025-11-22" },
  { name: "Leo Burnett",      email: "leo.b@email.com",     country: "AU", orders: 2, spent: 374.98,  joined: "2026-04-07" },
  { name: "Priya Sharma",     email: "priya.s@email.com",   country: "IN", orders: 3, spent: 629.97,  joined: "2026-01-29" },
  { name: "Tyler Conrad",     email: "tyler.c@email.com",   country: "US", orders: 5, spent: 964.95,  joined: "2025-09-15" },
  { name: "Emma Larsson",     email: "emma.l@email.com",    country: "SE", orders: 1, spent: 0,       joined: "2026-05-02" },
  { name: "Owen Kim",         email: "owen.k@email.com",    country: "KR", orders: 2, spent: 379.98,  joined: "2026-02-18" },
  { name: "Rebecca Foster",   email: "becca.f@email.com",   country: "US", orders: 6, spent: 1439.94, joined: "2025-08-10" },
  { name: "David Mensah",     email: "david.m@email.com",   country: "GH", orders: 1, spent: 244.00,  joined: "2026-06-01" },
  { name: "Clara Dubois",     email: "clara.d@email.com",   country: "FR", orders: 4, spent: 999.96,  joined: "2025-12-05" },
];

export default function AdminCustomersPage() {
  return (
    <div className="max-w-7xl space-y-5">
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {["Customer", "Country", "Orders", "Total Spent", "Member Since", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-5 py-3.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {CUSTOMERS.map((c) => {
                const initials = c.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
                const joined   = new Date(c.joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const tier     = c.spent >= 1000 ? { label: "Gold", bg: "bg-amber-50", text: "text-amber-700" }
                               : c.spent >= 500  ? { label: "Silver", bg: "bg-zinc-100", text: "text-zinc-600" }
                               : { label: "Standard", bg: "bg-blue-50", text: "text-blue-600" };
                return (
                  <tr key={c.email} className="hover:bg-zinc-50/70 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 text-xs">{c.name}</div>
                          <div className="text-[10px] text-zinc-400">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-zinc-500">{c.country}</td>
                    <td className="px-5 py-4 text-xs font-bold text-zinc-900">{c.orders}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-zinc-900 text-xs">${c.spent.toFixed(2)}</div>
                      <span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${tier.bg} ${tier.text}`}>
                        {tier.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-400">{joined}</td>
                    <td className="px-5 py-4">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-zinc-400 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 px-2.5 py-1.5 rounded-lg">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3.5 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-xs text-zinc-400">{CUSTOMERS.length} customers</p>
          <p className="text-xs text-zinc-500">Total spent: <span className="font-black text-zinc-900">${CUSTOMERS.reduce((s, c) => s + c.spent, 0).toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
}
