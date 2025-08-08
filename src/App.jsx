/* Full App.jsx code from the canvas */
import React, { useEffect, useMemo, useState } from "react";

export const SITE_NAME = "AmmoScout"; 
export const AFFILIATE_BASE = "https://example-affiliate.com/redirect?url=";

const SPONSORS = [
  { id: 1, name: "RangeReady", img: "https://placehold.co/300x80?text=RangeReady+Sponsor", url: "https://example-sponsor.com" },
];

const SAMPLE_PRODUCTS = [
  {
    id: "p1",
    title: "Federal Premium 9mm Luger 115gr FMJ",
    brand: "Federal",
    caliber: "9mm",
    price: 24.99,
    qty: 50,
    stock: "In Stock",
    link: "https://vendor.example/product/p1",
    image: "https://placehold.co/420x280?text=9mm+Federal",
  },
  {
    id: "p2",
    title: "Winchester .223 Rem 55gr FMJ",
    brand: "Winchester",
    caliber: ".223 Rem",
    price: 28.5,
    qty: 20,
    stock: "Low Stock",
    link: "https://vendor.example/product/p2",
    image: "https://placehold.co/420x280?text=.223+Winchester",
  },
  {
    id: "p3",
    title: "Remington 12ga 2-3/4" 1oz",
    brand: "Remington",
    caliber: "12ga",
    price: 15.0,
    qty: 200,
    stock: "In Stock",
    link: "https://vendor.example/product/p3",
    image: "https://placehold.co/420x280?text=12ga+Remington",
  },
];

function buildAffiliateLink(destUrl) {
  return `${AFFILIATE_BASE}${encodeURIComponent(destUrl)}`;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [caliberFilter, setCaliberFilter] = useState("Any");
  const [brandFilter, setBrandFilter] = useState("Any");
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  const calibers = useMemo(() => ["Any", ...Array.from(new Set(products.map((p) => p.caliber)))], [products]);
  const brands = useMemo(() => ["Any", ...Array.from(new Set(products.map((p) => p.brand)))], [products]);

  const filtered = useMemo(() => {
    let arr = products.slice();
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((p) => (p.title + " " + p.brand).toLowerCase().includes(q));
    }
    if (caliberFilter !== "Any") arr = arr.filter((p) => p.caliber === caliberFilter);
    if (brandFilter !== "Any") arr = arr.filter((p) => p.brand === brandFilter);

    if (sortBy === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") arr.sort((a, b) => b.price - a.price);
    else if (sortBy === "qty-desc") arr.sort((a, b) => b.qty - a.qty);

    return arr;
  }, [products, query, caliberFilter, brandFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">{SITE_NAME}</h1>
            <p className="text-sm text-gray-600">Search & compare ammo prices — sponsor & affiliate-enabled.</p>
          </div>

          <div className="w-full md:w-1/2">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                aria-label="Search ammo"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 rounded-lg p-3 shadow-sm border border-gray-200"
                placeholder="Search by caliber, brand, or model (e.g. '9mm Federal')"
              />
              <button className="px-4 py-3 bg-slate-900 text-white rounded-lg shadow">Search</button>
            </form>
            <div className="mt-2 flex gap-2 text-xs text-gray-500">
              <span>Tip: Use filters below for faster results</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4 items-center">
          {SPONSORS.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="inline-block">
              <img src={s.img} alt={`${s.name} sponsor`} className="h-12 object-contain rounded" />
            </a>
          ))}
          <div className="ml-auto text-sm text-gray-500">Sponsored listings may contain affiliate links.</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-3">Filters</h2>
          <label className="block text-sm mb-2">Caliber</label>
          <select value={caliberFilter} onChange={(e) => { setCaliberFilter(e.target.value); setPage(1); }} className="w-full p-2 border rounded">
            {calibers.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="block text-sm mt-4 mb-2">Brand</label>
          <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }} className="w-full p-2 border rounded">
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <label className="block text-sm mt-4 mb-2">Sort</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border rounded">
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="qty-desc">Quantity: High → Low</option>
          </select>

          <div className="mt-6 text-xs text-gray-500">
            Built for publishers: include your sponsor image/banner here and affiliate redirect links for each vendor.
          </div>
        </aside>

        <section className="md:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">{loading ? "Loading..." : `${filtered.length} results`}</div>
            <div>
              <button className="px-3 py-2 mr-2 border rounded text-sm" onClick={() => { setQuery(""); setCaliberFilter("Any"); setBrandFilter("Any"); setSortBy("relevance"); }}>Reset</button>
              <button className="px-3 py-2 border rounded text-sm" onClick={() => exportCSV(filtered)}>Export CSV</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page === 1}>Prev</button>
            <div className="px-3 py-1">Page {page} / {totalPages}</div>
            <button className="px-3 py-1 border rounded" onClick={() => setPage((s) => Math.min(totalPages, s + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} {SITE_NAME} — Sponsors & affiliates supported.
      </footer>
    </div>
  );
}

function ProductCard({ product }) {
  const affiliateLink = buildAffiliateLink(product.link);
  return (
    <article className="bg-white rounded-lg shadow p-3 flex flex-col">
      <img src={product.image} alt={product.title} className="rounded h-40 w-full object-cover mb-3" />
      <div className="flex-1">
        <h3 className="font-semibold">{product.title}</h3>
        <div className="text-xs text-gray-500">{product.brand} • {product.caliber}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
          <div className="text-xs text-gray-500">({product.qty} rounds)</div>
        </div>
        <div className="mt-3 flex gap-2 items-center">
          <a href={affiliateLink} target="_blank" rel="nofollow noopener noreferrer" className="flex-1 text-center px-3 py-2 rounded border bg-amber-500 text-white">Buy (Affiliate)</a>
          <a href={product.link} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded border">View</a>
        </div>
        <div className="mt-2 text-xs text-gray-400">{product.stock}</div>
      </div>
    </article>
  );
}

async function fetchProducts() {
  await timeout(400);
  return SAMPLE_PRODUCTS;
}

function timeout(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function exportCSV(items) {
  if (!items || items.length === 0) return alert("No data to export");
  const header = ["title,brand,caliber,price,qty,link"].join("\n");
  const rows = items.map((r) => `${escapeCsv(r.title)},${escapeCsv(r.brand)},${escapeCsv(r.caliber)},${r.price},${r.qty},${escapeCsv(r.link)}`);
  const csv = header + "\n" + rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ammoscout_export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(val) {
  if (typeof val !== "string") return val;
  if (val.includes(",") || val.includes('"') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}
