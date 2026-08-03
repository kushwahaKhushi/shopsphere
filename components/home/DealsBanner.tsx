"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer, ArrowRight } from "lucide-react";

function pad(n: number) { return String(n).padStart(2, "0"); }

function Digit({ val }: { val: number }) {
  return (
    <span className="bg-navbg text-white font-black text-sm w-9 h-9 rounded-xl
                     flex items-center justify-center shadow-sm tabular-nums border border-white/10">
      {pad(val)}
    </span>
  );
}

const TILES = [
  { emoji: "📱", label: "Smartphones",  discount: "Up to 40% off", href: "/products?subcategory=Smartphones" },
  { emoji: "🎧", label: "Headphones",   discount: "Up to 67% off", href: "/products?subcategory=Audio" },
  { emoji: "👟", label: "Footwear",     discount: "Up to 31% off", href: "/products?subcategory=Footwear" },
  { emoji: "🏠", label: "Home & Kitchen",discount:"Up to 42% off", href: "/products?category=Home+%26+Kitchen" },
];

export default function DealsBanner() {
  const [time, setTime] = useState({ h: 9, m: 42, s: 18 });
  const [mounted, set]  = useState(false);

  useEffect(() => {
    set(true);
    const end = Date.now() + (9 * 3600 + 42 * 60 + 18) * 1000;
    const id = setInterval(() => {
      const d = Math.max(0, end - Date.now());
      setTime({
        h: Math.floor(d / 3600000),
        m: Math.floor((d % 3600000) / 60000),
        s: Math.floor((d % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4
                      px-5 py-4 bg-gradient-to-r from-navbg to-primary">
        <div className="flex items-center gap-2.5 text-white">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow">
            <Timer size={18} className="text-white" />
          </div>
          <span className="font-black text-base">Deal of the Day</span>
        </div>

        {mounted && (
          <div className="flex items-center gap-1.5">
            <span className="text-teal-200 text-xs font-semibold mr-1">Ends in:</span>
            <Digit val={time.h} />
            <span className="text-white font-black text-lg leading-none">:</span>
            <Digit val={time.m} />
            <span className="text-white font-black text-lg leading-none">:</span>
            <Digit val={time.s} />
          </div>
        )}

        <Link href="/products?sort=discount"
          className="hidden sm:flex items-center gap-1 text-teal-200 hover:text-white
                     text-sm font-semibold transition-colors">
          View All <ArrowRight size={13} />
        </Link>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
        {TILES.map(({ emoji, label, discount, href }) => (
          <Link key={label} href={href}
            className="group flex flex-col items-center gap-2.5 py-7
                       hover:bg-primary-50 transition-colors">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
              {emoji}
            </span>
            <p className="text-sm font-bold text-gray-800">{label}</p>
            <p className="text-xs font-bold text-primary">{discount}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
