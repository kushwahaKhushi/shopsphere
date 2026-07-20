"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search } from "lucide-react";

interface Props {
  products: Product[];
}

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
  { label: "Discount", value: "discount" },
  { label: "Newest First", value: "newest" },
];

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹2,000", min: 500, max: 2000 },
  { label: "₹2,000 – ₹10,000", min: 2000, max: 10000 },
  { label: "₹10,000 – ₹50,000", min: 10000, max: 50000 },
  { label: "Above ₹50,000", min: 50000, max: Infinity },
];

export default function ProductsClient({ products }: Props) {
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState("relevance");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    brand: true,
    price: true,
    rating: true,
  });

  // Read URL params on mount
  useEffect(() => {
    const cat = searchParams.get("category");
    const subcat = searchParams.get("subcategory");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    if (cat) setSelectedCategories([cat]);
    if (subcat) setSearchQuery(subcat);
    if (search) setSearchQuery(search);
    if (sort === "discount") setSortBy("discount");
    if (sort === "rating") setSortBy("rating");
  }, [searchParams]);

  // Derive unique filter options from products
  const allCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );
  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setMinRating(0);
    setSearchQuery("");
    setSortBy("relevance");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedPriceRange !== null ||
    minRating > 0 ||
    searchQuery.trim().length > 0;

  // Filter + sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        result.sort((a, b) => b.discount - a.discount);
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategories, selectedBrands, selectedPriceRange, minRating, sortBy]);

  const FilterPanel = () => (
    <aside className="bg-white rounded-lg shadow-sm p-4 space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary" /> Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5">
          {selectedCategories.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 bg-primary-light text-primary text-xs px-2 py-0.5 rounded-full"
            >
              {c}
              <button onClick={() => toggleCategory(c)}><X size={10} /></button>
            </span>
          ))}
          {selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 bg-primary-light text-primary text-xs px-2 py-0.5 rounded-full"
            >
              {b}
              <button onClick={() => toggleBrand(b)}><X size={10} /></button>
            </span>
          ))}
          {selectedPriceRange !== null && (
            <span className="inline-flex items-center gap-1 bg-primary-light text-primary text-xs px-2 py-0.5 rounded-full">
              {PRICE_RANGES[selectedPriceRange].label}
              <button onClick={() => setSelectedPriceRange(null)}><X size={10} /></button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 bg-primary-light text-primary text-xs px-2 py-0.5 rounded-full">
              {minRating}★ & above
              <button onClick={() => setMinRating(0)}><X size={10} /></button>
            </span>
          )}
        </div>
      )}

      {/* Category */}
      <div>
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
        >
          Category
          {expandedSections.category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.category && (
          <div className="space-y-1.5">
            {allCategories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="accent-primary w-3.5 h-3.5"
                />
                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                  {cat}
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  ({products.filter((p) => p.category === cat).length})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t" />

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
        >
          Price Range
          {expandedSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.price && (
          <div className="space-y-1.5">
            {PRICE_RANGES.map((range, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange === i}
                  onChange={() =>
                    setSelectedPriceRange(selectedPriceRange === i ? null : i)
                  }
                  className="accent-primary w-3.5 h-3.5"
                />
                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t" />

      {/* Brand */}
      <div>
        <button
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
        >
          Brand
          {expandedSections.brand ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.brand && (
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {allBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="accent-primary w-3.5 h-3.5"
                />
                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t" />

      {/* Rating */}
      <div>
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
        >
          Customer Rating
          {expandedSections.rating ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expandedSections.rating && (
          <div className="space-y-1.5">
            {[4, 3, 2].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === r}
                  onChange={() => setMinRating(minRating === r ? 0 : r)}
                  className="accent-primary w-3.5 h-3.5"
                />
                <span className="text-sm text-gray-600 flex items-center gap-1 group-hover:text-primary transition-colors">
                  {"★".repeat(r)}{"☆".repeat(5 - r)} & above
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      {/* Breadcrumb */}
      <div className="mb-3">
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "All Products" },
          ]}
        />
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-3 flex items-center gap-2">
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded shadow-sm hover:border-primary"
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* Sort - mobile */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded shadow-sm focus:outline-none focus:border-primary bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden mb-4">
          <FilterPanel />
        </div>
      )}

      <div className="flex gap-4">
        {/* Sidebar filters - desktop */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <FilterPanel />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="bg-white rounded-lg shadow-sm px-4 py-3 mb-3 flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search within results */}
            <div className="flex items-center border border-gray-300 rounded overflow-hidden flex-1 max-w-xs">
              <Search size={15} className="ml-3 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-2 py-1.5 text-sm outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="px-2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
              </span>

              {/* Sort - desktop */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <div className="flex gap-1 flex-wrap">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                        sortBy === opt.value
                          ? "bg-primary text-white border-primary"
                          : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-16 text-center">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Try adjusting your filters or search terms.
              </p>
              <button onClick={clearAllFilters} className="btn-primary text-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
