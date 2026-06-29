"use client";

import { useState } from "react";
import { products } from "../../data/products";
import Link from "next/link";

type SortKey = "name" | "price" | "reviews" | "rating";

export default function AdminProductsPage() {
  const [search, setSearch]   = useState("");
  const [sort, setSort]       = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [catFilter, setCat]   = useState("All");

  const categories = ["All", "Running", "Casual", "Trail"];

  const toggleSort = (key: SortKey) => {
    if (sort === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSort(key); setSortDir("asc"); }
  };

  const filtered = products
    .filter((p) => {
      const q = search.trim().toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      const matchC = catFilter === "All" || p.category === catFilter;
      return matchQ && matchC;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sort === "name")    cmp = a.name.localeCompare(b.name);
      if (sort === "price")   cmp = a.price - b.price;
      if (sort === "reviews") cmp = a.reviews - b.reviews;
      if (sort === "rating")  cmp = a.rating - b.rating;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const SortIcon = ({ k }: { k: SortKey }) => (
    <svg className={`w-3 h-3 inline ml-1 transition-opacity ${sort === k ? "opacity-100" : "opacity-20"}`}
      fill="currentColor" viewBox="0 0 20 20">
      <path d={sortDir === "asc" || sort !== k
        ? "M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h5a1 1 0 000-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm10 0a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L13 14.586V11z"
        : "M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h5a1 1 0 000-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm13-4a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L16 7.586V4z"
      } />
    </svg>
  );

  return (
    <div className="max-w-7xl space-y-5">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <svg className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-200 bg-white rounded-xl outline-none focus:border-zinc-400 transition-colors" />
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                catFilter === c ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Add product (UI only) */}
        <button className="flex items-center gap-2 bg-zinc-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors ml-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {[
                  { label: "Product",  key: "name"    as SortKey },
                  { label: "Category", key: null },
                  { label: "Price",    key: "price"   as SortKey },
                  { label: "Rating",   key: "rating"  as SortKey },
                  { label: "Reviews",  key: "reviews" as SortKey },
                  { label: "Sizes",    key: null },
                  { label: "Status",   key: null },
                  { label: "",         key: null },
                ].map(({ label, key }) => (
                  <th key={label}
                    onClick={key ? () => toggleSort(key) : undefined}
                    className={`text-left text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-5 py-3.5 ${key ? "cursor-pointer hover:text-zinc-700 select-none" : ""}`}>
                    {label}
                    {key && <SortIcon k={key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/70 transition-colors group">
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: p.bgColor }} />
                      <div>
                        <div className="font-bold text-zinc-900">{p.name}</div>
                        <div className="text-xs text-zinc-400">{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full">{p.category}</span>
                  </td>
                  {/* Price */}
                  <td className="px-5 py-4">
                    <span className="font-bold text-zinc-900">${p.price}</span>
                    {p.originalPrice && (
                      <span className="text-xs text-zinc-400 line-through ml-1.5">${p.originalPrice}</span>
                    )}
                  </td>
                  {/* Rating */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-zinc-900 fill-zinc-900" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-semibold text-zinc-700">{p.rating}</span>
                    </div>
                  </td>
                  {/* Reviews */}
                  <td className="px-5 py-4 text-xs text-zinc-500 font-medium">{p.reviews}</td>
                  {/* Sizes */}
                  <td className="px-5 py-4 text-xs text-zinc-400">{p.sizes.length} sizes</td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      p.badge === "Sale" ? "bg-amber-50 text-amber-700" :
                      p.badge === "Limited" ? "bg-red-50 text-red-600" :
                      p.badge === "New" ? "bg-green-50 text-green-700" :
                      "bg-zinc-100 text-zinc-500"
                    }`}>
                      {p.badge ?? "Active"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/product/${p.id}`} target="_blank"
                        className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-colors" title="View">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                      <button className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-colors" title="Edit">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-xs text-zinc-400">{filtered.length} of {products.length} products</p>
          <p className="text-xs text-zinc-400">
            Total catalog value: <span className="font-bold text-zinc-700">
              ${products.reduce((s, p) => s + p.price, 0).toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
