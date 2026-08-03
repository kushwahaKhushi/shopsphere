"use client";

import Link   from "next/link";
import Image  from "next/image";
import { useState } from "react";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Product } from "@/types";
import { useCart }  from "@/context/CartContext";
import toast        from "react-hot-toast";

const FALLBACK = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [wishlisted, setWish] = useState(false);
  const [imgSrc,     setImg]  = useState(product.images?.[0] || FALLBACK);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Added to cart!`, {
      icon: "🛒",
      duration: 1800,
      style: { background: "#0d3d39", color: "#f0fdfa" },
    });
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWish((v) => !v);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️", {
      duration: 1400,
    });
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <div className="relative h-full flex flex-col bg-white rounded-2xl border border-gray-100
                      shadow-card hover:shadow-card-lg hover:-translate-y-1
                      transition-all duration-300 overflow-hidden">

        {/* ── Image ─────────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
             style={{ paddingTop: "100%" }}>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-contain p-5 img-zoom"
            unoptimized
            onError={() => setImg(FALLBACK)}
          />

          {/* Top-left: discount */}
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 discount-badge z-10">
              -{product.discount}%
            </span>
          )}

          {/* Top-right: wishlist */}
          <button
            onClick={handleWish}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full
                        flex items-center justify-center shadow-sm
                        border transition-all duration-200
                        ${wishlisted
                          ? "bg-red-50 border-red-200 text-red-500"
                          : "bg-white border-gray-200 text-gray-400 opacity-0 group-hover:opacity-100"
                        }`}
            aria-label="Wishlist"
          >
            <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>

          {/* Bottom: quick-action bar on hover */}
          <div className="absolute bottom-0 left-0 right-0 z-10
                          flex gap-2 p-3
                          translate-y-full group-hover:translate-y-0
                          transition-transform duration-250 ease-out">
            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-1.5
                         bg-primary hover:bg-primary-dark text-white
                         text-xs font-bold py-2.5 rounded-xl
                         transition-colors shadow-glow"
            >
              <ShoppingCart size={13} />
              Add to Cart
            </button>
           <button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/product/${product.id}`;
  }}
  className="w-9 flex items-center justify-center
             bg-white border border-gray-200 rounded-xl
             hover:border-primary hover:text-primary
             transition-colors shadow-sm"
  aria-label="Quick view"
>
  <Eye size={14} />
</button>
          </div>

          {/* Low-stock ribbon */}
          {product.stock > 0 && product.stock < 6 && (
            <span className="absolute bottom-0 left-0 right-0 bg-red-500/90
                             text-white text-[10px] font-bold text-center py-1
                             group-hover:bottom-[52px] transition-all duration-250">
              Only {product.stock} left!
            </span>
          )}
        </div>

        {/* ── Info ──────────────────────────────────── */}
        <div className="flex flex-col gap-1.5 p-3.5 flex-1">
          {/* Brand */}
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider truncate">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug flex-1">
            {product.name}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {stars.map((s) => (
                <Star
                  key={s}
                  size={11}
                  className={product.rating >= s ? "star-filled" : "star-empty"}
                  fill={product.rating >= s ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 leading-none">
              ({product.reviewCount.toLocaleString("en-IN")})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="price-current">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="price-original">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="price-saving">{product.discount}% off</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
