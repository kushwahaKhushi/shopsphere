"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer } from "lucide-react";

function Digit({ val }: { val: number }) {
  return (
    <span className="bg-navbg text-white font-bold text-sm w-8 h-8 flex items-center justify-center rounded-md tabular-nums">
      {String(val).padStart(2, "0")}
    </span>
  );
}

export default function DealsBanner() {
  const [mounted, setMounted] = useState(false);

  const [time, setTime] = useState({
    h: 9,
    m: 42,
    s: 18,
  });

  useEffect(() => {
    setMounted(true);

    const target = new Date(
      Date.now() + 9 * 60 * 60 * 1000 + 42 * 60 * 1000 + 18 * 1000
    );

    const updateTimer = () => {
      const diff = Math.max(0, target.getTime() - Date.now());

      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden h-56 animate-pulse" />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-navbg to-primary">
        <div className="flex items-center gap-2 text-white">
          <Timer size={20} />
          <span className="font-bold text-base">Deal of the Day</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-teal-200 text-xs font-medium">
            Ends in:
          </span>

          <Digit val={time.h} />
          <span className="text-white font-bold">:</span>
          <Digit val={time.m} />
          <span className="text-white font-bold">:</span>
          <Digit val={time.s} />
        </div>

        <Link
          href="/products?sort=discount"
          className="text-xs text-teal-200 hover:text-white underline underline-offset-2 hidden sm:block"
        >
          View All
        </Link>
      </div>

      {/* Category Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 border-t">
        {[
          {
            label: "Smartphones",
            discount: "Up to 40% off",
            color: "text-primary",
            emoji: "📱",
          },
          {
            label: "Headphones",
            discount: "Up to 67% off",
            color: "text-purple-600",
            emoji: "🎧",
          },
          {
            label: "Footwear",
            discount: "Up to 31% off",
            color: "text-pink-600",
            emoji: "👟",
          },
          {
            label: "Home & Kitchen",
            discount: "Up to 42% off",
            color: "text-emerald-600",
            emoji: "🏠",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={`/products?category=${encodeURIComponent(item.label)}`}
            className="flex flex-col items-center justify-center py-6 gap-2 hover:bg-primary-50 transition-colors group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">
              {item.emoji}
            </span>

            <p className="text-sm font-semibold text-gray-800">
              {item.label}
            </p>

            <p className={`text-xs font-bold ${item.color}`}>
              {item.discount}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}