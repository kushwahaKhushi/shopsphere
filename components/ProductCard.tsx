"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`, {
      icon: "🛒",
      duration: 2000,
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="card h-full flex flex-col overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 border-b">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 discount-badge">
              {product.discount}% off
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1 gap-1">
          {/* Brand */}
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star size={10} fill="white" strokeWidth={0} />
            </div>
            <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString("en-IN")})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="mt-auto pt-2 w-full flex items-center justify-center gap-2 bg-primary text-white text-sm py-2 rounded hover:bg-primary-dark transition-colors font-medium"
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
