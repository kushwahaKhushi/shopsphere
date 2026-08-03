"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link  from "next/link";
import {
  SlidersHorizontal, X, ChevronDown, ChevronUp,
  Search, LayoutGrid, LayoutList, Sparkles,
  ShoppingCart, Star,
} from "lucide-react";
import { Product }    from "@/types";
import ProductCard    from "@/components/ProductCard";
import Breadcrumb     from "@/components/Breadcrumb";
import { useCart }    from "@/context/CartContext";
import toast          from "react-hot-toast";

/* ── Constants ─────────────────────────────────────────── */
const FALLBACK = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80";

const SORT_OPTIONS = [
  { label: "Relevance",         value: "relevance"  },
  { label: "Price: Low → High", value: "price_asc"  },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Rating",            value: "rating"     },
  { label: "Best Discount",     value: "discount"   },
  { label: "Newest First",      value: "newest"     },
];

const PRICE_RANGES = [
  { label: "Under ₹500",         min: 0,     max: 500       },
  { label: "₹500 – ₹2,000",      min: 500,   max: 2000      },
  { label: "₹2,000 – ₹10,000",   min: 2000,  max: 10000     },
  { label: "₹10,000 – ₹50,000",  min: 10000, max: 50000     },
  { label: "Above ₹50,000",       min: 50000, max: Infinity  },
];

/* ── Main component ────────────────────────────────────── */
export default function ProductsClient({ products }: { products: Product[] }) {
  const sp = useSearchParams();

  const [sortBy,     setSortBy]   = useState("relevance");
  const [selCats,    setSelCats]  = useState<string[]>([]);
  const [selBrands,  setSelBr]    = useState<string[]>([]);
  const [priceIdx,   setPrice]    = useState<number | null>(null);
  const [minRating,  setRating]   = useState(0);
  const [query,      setQuery]    = useState("");
  const [mobileOpen, setMob]      = useState(false);
  const [grid,       setGrid]     = useState<"grid" | "list">("grid");
  const [open, setOpen] = useState<Record<string, boolean>>({
    category: true, price: true, brand: false, rating: false,
  });

  useEffect(() => {
    const cat  = sp.get("category");
    const sub  = sp.get("subcategory");
    const srch = sp.get("search");
    const sort = sp.get("sort");
    const br   = sp.get("brand");
    if (cat)  setSelCats([cat]);
    if (sub)  setQuery(sub);
    if (srch) setQuery(srch);
    if (br)   setSelBr([br]);
    if (sort === "discount") setSortBy("discount");
    if (sort === "rating")   setSortBy("rating");
  }, [sp]);

  const allCats   = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products]);
  const allBrands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(),    [products]);

  const tog = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const clearAll = () => {
    setSelCats([]); setSelBr([]); setPrice(null);
    setRating(0);   setQuery(""); setSortBy("relevance");
  };

  const hasF = selCats.length > 0 || selBrands.length > 0 ||
    priceIdx !== null || minRating > 0 || query.trim().length > 0;

  const filtered = useMemo(() => {
    let r = [...products];
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selCats.length)   r = r.filter((p) => selCats.includes(p.category));
    if (selBrands.length) r = r.filter((p) => selBrands.includes(p.brand));
    if (priceIdx !== null) {
      const { min, max } = PRICE_RANGES[priceIdx];
      r = r.filter((p) => p.price >= min && p.price < max);
    }
    if (minRating > 0) r = r.filter((p) => p.rating >= minRating);
    switch (sortBy) {
      case "price_asc":  r.sort((a, b) => a.price - b.price);        break;
      case "price_desc": r.sort((a, b) => b.price - a.price);        break;
      case "rating":     r.sort((a, b) => b.rating - a.rating);      break;
      case "discount":   r.sort((a, b) => b.discount - a.discount);  break;
      case "newest":
        r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return r;
  }, [products, query, selCats, selBrands, priceIdx, minRating, sortBy]);

  /* Sidebar component (inline) */
  const SidebarContent = (
    <div className="bg-white rounded-2xl shadow-card p-5 space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <span className="font-black text-gray-900 text-sm flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-primary" /> Filters
        </span>
        {hasF && (
          <button onClick={clearAll}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            <X size={10} /> Clear all
          </button>
        )}
      </div>

      {/* Active chips */}
      {hasF && (
        <div className="flex flex-wrap gap-1.5 pb-4 border-b">
          {selCats.map((c) => (
            <span key={c}
              className="inline-flex items-center gap-1 bg-primary-100 text-primary
                         text-xs font-semibold px-2.5 py-1 rounded-full">
              {c}
              <button onClick={() => setSelCats((p) => p.filter((v) => v !== c))}><X size={9} /></button>
            </span>
          ))}
          {selBrands.map((b) => (
            <span key={b}
              className="inline-flex items-center gap-1 bg-primary-100 text-primary
                         text-xs font-semibold px-2.5 py-1 rounded-full">
              {b}
              <button onClick={() => setSelBr((p) => p.filter((v) => v !== b))}><X size={9} /></button>
            </span>
          ))}
          {priceIdx !== null && (
            <span className="inline-flex items-center gap-1 bg-accent-50 text-accent-dark
                             text-xs font-semibold px-2.5 py-1 rounded-full">
              {PRICE_RANGES[priceIdx].label}
              <button onClick={() => setPrice(null)}><X size={9} /></button>
            </span>
          )}
        </div>
      )}

      {/* Category */}
      <Section label="Category" open={open.category} toggle={() => setOpen((o) => ({ ...o, category: !o.category }))}>
        {allCats.map((cat) => (
          <FChk key={cat} label={cat} checked={selCats.includes(cat)}
            count={products.filter((p) => p.category === cat).length}
            onChange={() => setSelCats((p) => tog(p, cat))} />
        ))}
      </Section>

      {/* Price */}
      <Section label="Price Range" open={open.price} toggle={() => setOpen((o) => ({ ...o, price: !o.price }))}>
        {PRICE_RANGES.map((r, i) => (
          <label key={i} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
            <input type="radio" name="price" checked={priceIdx === i}
              onChange={() => setPrice(priceIdx === i ? null : i)}
              className="accent-primary w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
              {r.label}
            </span>
          </label>
        ))}
      </Section>

      {/* Brand */}
      <Section label="Brand" open={open.brand} toggle={() => setOpen((o) => ({ ...o, brand: !o.brand }))}>
        <div className="max-h-44 overflow-y-auto space-y-0.5 pr-1">
          {allBrands.map((b) => (
            <FChk key={b} label={b} checked={selBrands.includes(b)}
              onChange={() => setSelBr((p) => tog(p, b))} />
          ))}
        </div>
      </Section>

      {/* Rating */}
      <Section label="Customer Rating" open={open.rating} toggle={() => setOpen((o) => ({ ...o, rating: !o.rating }))}>
        {[4, 3, 2].map((r) => (
          <label key={r} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
            <input type="radio" name="rating" checked={minRating === r}
              onChange={() => setRating(minRating === r ? 0 : r)}
              className="accent-primary w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-sm text-gray-600 group-hover:text-primary flex items-center gap-1 transition-colors">
              {"★".repeat(r)}{"☆".repeat(5 - r)}
              <span className="text-gray-400 text-xs ml-0.5">& above</span>
            </span>
          </label>
        ))}
      </Section>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
      <div className="mb-4">
        <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "All Products" }]} />
      </div>

      {/* Mobile filter + sort */}
      <div className="lg:hidden mb-4 flex items-center gap-2">
        <button onClick={() => setMob((v) => !v)}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700
                     text-sm px-4 py-2.5 rounded-xl shadow-card hover:border-primary transition-colors">
          <SlidersHorizontal size={14} />
          Filters
          {hasF && (
            <span className="w-5 h-5 bg-primary text-white text-[10px] font-black
                             rounded-full flex items-center justify-center">
              {selCats.length + selBrands.length + (priceIdx !== null ? 1 : 0) + (minRating > 0 ? 1 : 0)}
            </span>
          )}
        </button>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 border border-gray-200 bg-white text-gray-700 text-sm
                     px-3 py-2.5 rounded-xl shadow-card focus:outline-none focus:border-primary">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {mobileOpen && <div className="lg:hidden mb-4">{SidebarContent}</div>}

      <div className="flex gap-5">
        {/* Sidebar — desktop */}
        <div className="hidden lg:block w-58 flex-shrink-0 sticky top-20 self-start min-w-[220px]">
          {SidebarContent}
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-white rounded-2xl shadow-card px-4 py-3 mb-5
                          flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex items-center border border-gray-200 rounded-xl
                            bg-gray-50 flex-1 min-w-[150px] max-w-xs overflow-hidden">
              <Search size={14} className="ml-3 text-gray-400 flex-shrink-0" />
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search within results…"
                className="flex-1 px-2 py-2.5 text-sm bg-transparent outline-none
                           text-gray-800 placeholder-gray-400" />
              {query && (
                <button onClick={() => setQuery("")} className="px-2 text-gray-400 hover:text-gray-700">
                  <X size={12} />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{filtered.length}</span> products
            </p>

            {/* Sort tabs — desktop */}
            <div className="hidden md:flex items-center gap-1 ml-auto flex-wrap">
              {SORT_OPTIONS.map((o) => (
                <button key={o.value} onClick={() => setSortBy(o.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    sortBy === o.value
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-500 hover:text-primary hover:bg-primary-50"
                  }`}>
                  {o.label}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1">
              <button onClick={() => setGrid("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  grid === "grid" ? "bg-primary text-white" : "text-gray-400 hover:text-primary"
                }`}>
                <LayoutGrid size={14} />
              </button>
              <button onClick={() => setGrid("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  grid === "list" ? "bg-primary text-white" : "text-gray-400 hover:text-primary"
                }`}>
                <LayoutList size={14} />
              </button>
            </div>
          </div>

          {/* Products */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card p-16 text-center">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Sparkles size={36} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                Try adjusting your filters or search terms.
              </p>
              <button onClick={clearAll} className="btn-primary px-8">Clear Filters</button>
            </div>
          ) : grid === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((p) => <ListCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────── */

function Section({
  label, open, toggle, children,
}: { label: string; open: boolean; toggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-t pt-4 pb-1">
      <button onClick={toggle}
        className="flex items-center justify-between w-full text-sm font-bold
                   text-gray-800 mb-3">
        {label}
        {open ? <ChevronUp size={14} className="text-gray-400" />
              : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="space-y-1.5">{children}</div>}
    </div>
  );
}

function FChk({ label, checked, onChange, count }: {
  label: string; checked: boolean; onChange: () => void; count?: number;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <input type="checkbox" checked={checked} onChange={onChange}
        className="accent-primary w-3.5 h-3.5 flex-shrink-0 rounded" />
      <span className="text-sm text-gray-600 group-hover:text-primary transition-colors flex-1">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-400 font-medium">({count})</span>
      )}
    </label>
  );
}

function ListCard({ product }: { product: Product }) {
  const { addToCart }   = useCart();
  const [src, setSrc]   = useState(product.images?.[0] || FALLBACK);

  return (
    <Link href={`/product/${product.id}`}
      className="group flex bg-white rounded-2xl border border-gray-100
                 shadow-card hover:shadow-card-lg hover:-translate-y-0.5
                 transition-all duration-200 overflow-hidden">
      <div className="relative w-36 sm:w-48 flex-shrink-0 bg-gray-50">
        <Image src={src} alt={product.name} fill
          className="object-contain p-4 img-zoom" unoptimized
          onError={() => setSrc(FALLBACK)} />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 discount-badge">{product.discount}%</span>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between gap-2">
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-wide mb-1">{product.brand}</p>
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={11}
                className={product.rating > i ? "star-filled" : "star-empty"}
                fill={product.rating > i ? "currentColor" : "none"} strokeWidth={1.5} />
            ))}
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="price-current">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice > product.price && (
              <span className="price-original">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault(); e.stopPropagation();
              addToCart(product, 1);
              toast.success("Added to cart!", { icon: "🛒", duration: 1800 });
            }}
            className="btn-primary py-2 px-4 text-xs">
            <ShoppingCart size={13} /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
