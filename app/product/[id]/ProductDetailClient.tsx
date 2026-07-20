"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star, ShoppingCart, Zap, Shield, Truck, RefreshCw,
  CheckCircle2, MinusCircle, PlusCircle, Heart, Share2,
} from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "features" | "reviews">("description");

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity}× ${product.name} added to cart!`, { icon: "🛒" });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  const savings = product.originalPrice - product.price;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
            { label: product.subcategory, href: `/products?subcategory=${encodeURIComponent(product.subcategory)}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left — Images */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
            {/* Main image */}
            <div className="relative aspect-square mb-3 rounded overflow-hidden border bg-gray-50">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-contain p-4"
                unoptimized
                priority
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 discount-badge text-sm px-2 py-1">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 rounded border-2 overflow-hidden bg-gray-50 transition-colors ${
                      i === activeImage ? "border-primary" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1" unoptimized />
                  </button>
                ))}
              </div>
            )}

            {/* Action buttons under image */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold py-3 rounded transition-colors"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded transition-colors"
              >
                <Zap size={18} /> Buy Now
              </button>
            </div>

            {/* Wishlist / Share */}
            <div className="flex gap-4 mt-3 justify-center text-sm text-gray-500">
              <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                <Heart size={15} /> Wishlist
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Share2 size={15} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Right — Info */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-5">
            {/* Brand */}
            <p className="text-sm text-primary font-semibold mb-1">{product.brand}</p>

            {/* Name */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-3">
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-bold px-2.5 py-1 rounded">
                <span>{product.rating}</span>
                <Star size={13} fill="white" strokeWidth={0} />
              </div>
              <span className="text-sm text-gray-500">
                {product.reviewCount.toLocaleString()} ratings &amp; reviews
              </span>
            </div>

            <div className="border-t border-dashed pt-4 mb-4">
              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {product.discount}% off
                    </span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  You save ₹{savings.toLocaleString()} on this order!
                </p>
              )}
            </div>

            {/* Offers */}
            <div className="bg-gray-50 rounded p-3 mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Available Offers</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">Bank Offer</span>
                  10% off on SBI Credit Cards, up to ₹1,500. T&amp;C apply
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">EMI</span>
                  Starting from ₹{Math.ceil(product.price / 12).toLocaleString()}/month
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">No Cost EMI</span>
                  Available on select cards. Min transaction ₹3,000
                </li>
              </ul>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-gray-500 hover:text-primary transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <MinusCircle size={24} />
                </button>
                <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="text-gray-500 hover:text-primary transition-colors disabled:opacity-40"
                  disabled={quantity >= product.stock}
                >
                  <PlusCircle size={24} />
                </button>
              </div>
              <span className={`text-sm ml-2 ${product.stock < 10 ? "text-red-500 font-semibold" : "text-gray-500"}`}>
                {product.stock < 10 ? `Only ${product.stock} left!` : `${product.stock} in stock`}
              </span>
            </div>

            {/* Delivery & Services */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Truck size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Free Delivery</p>
                  <p className="text-xs text-gray-400">By tomorrow, 10 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">7-Day Returns</p>
                  <p className="text-xs text-gray-400">Hassle-free returns</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Secure Payment</p>
                  <p className="text-xs text-gray-400">100% protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs — Description / Features / Reviews */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex border-b">
              {(["description", "features", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === "description" && (
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              )}
              {activeTab === "features" && (
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900">{product.rating}</div>
                      <div className="flex justify-center my-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={product.rating >= s ? "text-accent" : "text-gray-300"}
                            fill={product.rating >= s ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">{product.reviewCount.toLocaleString()} ratings</div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct = star === 5 ? 52 : star === 4 ? 28 : star === 3 ? 12 : star === 2 ? 5 : 3;
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-2">{star}</span>
                            <Star size={10} className="text-accent" fill="currentColor" />
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-accent h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-6 text-right">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sample reviews */}
                  {[
                    { name: "Rahul S.", rating: 5, comment: "Excellent product! Exactly as described. Very happy with the quality and fast delivery.", date: "2 weeks ago" },
                    { name: "Priya M.", rating: 4, comment: "Good value for money. Works perfectly. Minor packaging issue but product is great.", date: "1 month ago" },
                    { name: "Amit K.", rating: 4, comment: "Solid build quality. Would recommend to anyone looking for this category.", date: "3 months ago" },
                  ].map((review, i) => (
                    <div key={i} className="border-t py-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-800">{review.name}</span>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={review.rating >= s ? "text-accent" : "text-gray-300"} fill={review.rating >= s ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 border-l-4 border-primary pl-2">
              Similar Products
            </h2>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs text-primary font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
