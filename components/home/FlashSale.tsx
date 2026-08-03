"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

interface Props { products: Product[] }

function pad(n: number) { return String(n).padStart(2, "0"); }

function Block({ val, label }: { val: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-white/20 backdrop-blur-sm text-white font-black
                       text-xl sm:text-2xl min-w-[3rem] sm:min-w-[3.5rem] h-12 sm:h-14
                       rounded-xl flex items-center justify-center
                       border border-white/10 shadow-inner tabular-nums">
        {pad(val)}
      </span>
      <span className="text-white/60 text-[10px] mt-1 uppercase tracking-wider font-semibold">
        {label}
      </span>
    </div>
  );
}

export default function FlashSale({ products }: Props) {
  const [time, setTime]       = useState({ h: 5, m: 59, s: 59 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const end = Date.now() + (5 * 3600 + 59 * 60 + 59) * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const flash = [...products].sort((a, b) => b.discount - a.discount).slice(0, 6);
  if (!flash.length) return null;

  return (
    <section className="rounded-3xl overflow-hidden shadow-card">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#ec4899]
                      px-6 py-5 flex flex-wrap items-center gap-5">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center
                          border border-white/10 flex-shrink-0 shadow-inner">
            <Zap size={22} className="text-yellow-300" fill="currentColor" />
          </div>
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
              Limited Time Offer
            </p>
            <h2 className="text-white font-black text-2xl sm:text-3xl leading-tight">
              Flash Sale ⚡
            </h2>
          </div>
          <p className="hidden sm:block text-white/60 text-sm max-w-xs">
            Up to 70% off on top products. Don&apos;t miss out!
          </p>
        </div>

        {/* Countdown */}
        {mounted && (
          <div className="flex items-center gap-2 sm:ml-auto">
            <Block val={time.h} label="Hrs" />
            <span className="text-white/60 font-black text-xl -mt-4">:</span>
            <Block val={time.m} label="Min" />
            <span className="text-white/60 font-black text-xl -mt-4">:</span>
            <Block val={time.s} label="Sec" />
          </div>
        )}

        <Link href="/products?sort=discount"
          className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20
                     border border-white/20 text-white text-sm font-semibold
                     px-4 py-2.5 rounded-xl transition-colors">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* Products */}
      <div className="bg-white p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {flash.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
