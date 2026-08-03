"use client";

import { useState, useEffect } from "react";
import Link   from "next/link";
import Image  from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ShoppingCart, Star, TrendingUp } from "lucide-react";

const SLIDES = [
  {
    badge:    "Summer Collection 2024",
    headline: ["Find Your Style,", "Love Your Look ✨"],
    sub:      "Discover premium fashion, electronics & accessories with unbeatable deals.",
    cta:      "Shop Now",
    ctaLink:  "/products?category=Fashion",
    bg:       "from-[#0d3d39] to-[#1a6b64]",
    accent:   "from-orange-400 to-amber-300",
    img:      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&q=85",
    tag:      "NEW ARRIVALS",
    tagBg:    "bg-pink-500",
    product:  {
      name:  "Premium Hoodie",
      price: "₹2,499",
      orig:  "₹3,999",
      rating: 4.8,
      img:  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    },
  },
  {
    badge:    "Mega Electronics Sale",
    headline: ["Upgrade Your", "Tech Life ⚡"],
    sub:      "Up to 40% off on Smartphones, Laptops, Audio & More. Limited time deals.",
    cta:      "Explore Electronics",
    ctaLink:  "/products?category=Electronics",
    bg:       "from-[#1e1b4b] to-[#312e81]",
    accent:   "from-cyan-400 to-blue-400",
    img:      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=85",
    tag:      "UP TO 40% OFF",
    tagBg:    "bg-accent",
    product:  {
      name:  "Sony Headphones",
      price: "₹26,990",
      orig:  "₹34,990",
      rating: 4.7,
      img:   "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    },
  },
  {
    badge:    "Home Makeover Sale",
    headline: ["Transform Your", "Living Space 🏡"],
    sub:      "Curated home essentials, kitchen appliances and décor from ₹299.",
    cta:      "Shop Home",
    ctaLink:  "/products?category=Home+%26+Kitchen",
    bg:       "from-[#064e3b] to-[#065f46]",
    accent:   "from-lime-400 to-green-400",
    img:      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=85",
    tag:      "BEST DEALS",
    tagBg:    "bg-green-500",
    product:  {
      name:  "Pressure Cooker",
      price: "₹1,299",
      orig:  "₹1,899",
      rating: 4.4,
      img:   "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80",
    },
  },
];

export default function HeroSection() {
  const [cur,    setCur]    = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCur((c) => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const prev = () => setCur((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCur((c) => (c + 1) % SLIDES.length);
  const s = SLIDES[cur];

  return (
    <div
      className={`relative bg-gradient-to-br ${s.bg} rounded-3xl overflow-hidden
                  shadow-xl transition-all duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image (subtle) */}
      <div className="absolute inset-0">
        <Image src={s.img} alt="" fill className="object-cover opacity-10" unoptimized />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-white/5 blur-2xl" />

      {/* Content grid */}
      <div className="relative z-10 grid lg:grid-cols-2 min-h-[340px] sm:min-h-[420px]">

        {/* Left — copy */}
        <div className="flex flex-col justify-center px-8 sm:px-12 py-10 lg:py-12">
          {/* Badge */}
          <span className={`${s.tagBg} inline-flex items-center gap-1.5 text-white
                           text-[11px] font-black px-3 py-1.5 rounded-full mb-5 w-fit
                           tracking-widest shadow-sm`}>
            <Sparkles size={11} /> {s.badge}
          </span>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            {s.headline[0]}
            <br />
            <span className={`bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>
              {s.headline[1]}
            </span>
          </h1>

          <p className="text-white/70 text-sm sm:text-base mb-8 max-w-sm leading-relaxed">
            {s.sub}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link href={s.ctaLink}
              className="inline-flex items-center gap-2 bg-white text-gray-900
                         font-bold px-6 py-3 rounded-2xl shadow-lg
                         hover:scale-105 hover:shadow-xl active:scale-95
                         transition-all duration-150 text-sm">
              <ShoppingCart size={16} />
              {s.cta}
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white
                         text-sm font-semibold border border-white/20 hover:border-white/50
                         px-5 py-3 rounded-2xl transition-all duration-150">
              <TrendingUp size={15} /> View Deals
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-8 pt-6 border-t border-white/10">
            {[["25K+", "Happy Customers"], ["4.9★", "Avg. Rating"], ["1,200+", "Brands"]].map(
              ([v, l]) => (
                <div key={l}>
                  <p className="text-white font-black text-lg leading-none">{v}</p>
                  <p className="text-white/50 text-[11px] mt-0.5">{l}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right — floating product card */}
        <div className="hidden lg:flex items-center justify-center px-8 py-12">
          <div className="relative">
            {/* Main product card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20
                            rounded-3xl p-5 w-72 shadow-2xl">
              {/* Product image */}
              <div className="bg-white/20 rounded-2xl p-4 mb-4 aspect-square flex items-center justify-center overflow-hidden">
                <Image
                  src={s.product.img}
                  alt={s.product.name}
                  width={200}
                  height={200}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
              {/* Info */}
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
                Featured Item
              </p>
              <h3 className="text-white font-bold text-base mb-2">{s.product.name}</h3>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={12}
                    className={s.product.rating >= i ? "text-amber-400" : "text-white/20"}
                    fill={s.product.rating >= i ? "currentColor" : "none"} />
                ))}
                <span className="text-white/60 text-xs ml-1">{s.product.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-black text-xl">{s.product.price}</span>
                  <span className="text-white/40 text-sm line-through ml-2">{s.product.orig}</span>
                </div>
                <Link href={s.ctaLink}
                  className="bg-white text-gray-900 font-bold text-xs px-3 py-2 rounded-xl
                             hover:bg-accent hover:text-white transition-colors">
                  Buy Now
                </Link>
              </div>
            </div>

            {/* Floating badge: discount */}
            <div className="absolute -top-4 -right-4 bg-accent text-white font-black text-sm
                            w-14 h-14 rounded-full flex items-center justify-center shadow-lg
                            animate-float">
              SALE
            </div>

            {/* Floating: "Just bought" toast */}
            <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl px-4 py-3
                            shadow-xl flex items-center gap-2.5 w-max">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingCart size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Just purchased!</p>
                <p className="text-[10px] text-gray-400">2 mins ago · Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button onClick={prev} aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20
                   bg-white/10 hover:bg-white/20 text-white rounded-full p-2
                   backdrop-blur-sm border border-white/10 transition-colors">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20
                   bg-white/10 hover:bg-white/20 text-white rounded-full p-2
                   backdrop-blur-sm border border-white/10 transition-colors">
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCur(i)}
            className={`h-1.5 rounded-full transition-all duration-300
                        ${i === cur ? "bg-white w-8" : "bg-white/30 w-1.5"}`} />
        ))}
      </div>
    </div>
  );
}
