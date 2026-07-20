"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Mega Electronics Sale",
    subtitle: "Up to 40% off on Smartphones, Laptops & More",
    cta: "Shop Now",
    href: "/products?category=Electronics",
    bg: "from-navbg via-primary-dark to-primary",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&q=80",
    badge: "LIMITED TIME",
    badgeColor: "bg-accent",
  },
  {
    id: 2,
    title: "Fashion Week Specials",
    subtitle: "Trendy styles at unbeatable prices — New arrivals daily",
    cta: "Explore Fashion",
    href: "/products?category=Fashion",
    bg: "from-purple-900 via-purple-800 to-pink-700",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80",
    badge: "NEW ARRIVALS",
    badgeColor: "bg-pink-500",
  },
  {
    id: 3,
    title: "Home Makeover Sale",
    subtitle: "Transform your home with top brands — Deals from ₹299",
    cta: "Shop Home",
    href: "/products?category=Home+%26+Kitchen",
    bg: "from-emerald-900 via-emerald-800 to-teal-700",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80",
    badge: "BEST DEALS",
    badgeColor: "bg-green-500",
  },
  {
    id: 4,
    title: "Audio Fest",
    subtitle: "Premium headphones & speakers — Starting ₹999",
    cta: "Listen Now",
    href: "/products?subcategory=Audio",
    bg: "from-gray-900 via-gray-800 to-gray-700",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
    badge: "TOP PICKS",
    badgeColor: "bg-accent",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const slide = slides[current];

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md h-56 sm:h-72 md:h-80">
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-all duration-700`} />
      <Image src={slide.image} alt={slide.title} fill
        className="object-cover opacity-15" unoptimized priority />

      <div className="relative z-10 h-full flex items-center px-8 sm:px-14">
        <div className="max-w-lg">
          <span className={`${slide.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block tracking-widest`}>
            {slide.badge}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-2 drop-shadow">
            {slide.title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base mb-6">{slide.subtitle}</p>
          <Link href={slide.href}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm shadow-lg">
            {slide.cta} →
          </Link>
        </div>
      </div>

      <button onClick={prev} aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors">
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/40 w-2"}`} />
        ))}
      </div>
    </div>
  );
}
