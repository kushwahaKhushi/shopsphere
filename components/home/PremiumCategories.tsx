import Link from "next/link";
import {
  Smartphone, Laptop, Headphones, Shirt,
  Home, Camera, Watch, Tv, Dumbbell, ShoppingBag,
  Zap, Gift,
} from "lucide-react";

const CATS = [
  { label: "Mobiles",    Icon: Smartphone, href: "/products?subcategory=Smartphones", from: "#0ea5e9", to: "#0284c7" },
  { label: "Laptops",    Icon: Laptop,     href: "/products?subcategory=Laptops",      from: "#8b5cf6", to: "#7c3aed" },
  { label: "Audio",      Icon: Headphones, href: "/products?subcategory=Audio",        from: "#ec4899", to: "#db2777" },
  { label: "Fashion",    Icon: Shirt,      href: "/products?category=Fashion",         from: "#f97316", to: "#ea580c" },
  { label: "Watches",    Icon: Watch,      href: "/products?subcategory=Watches",      from: "#f59e0b", to: "#d97706" },
  { label: "Home",       Icon: Home,       href: "/products?category=Home+%26+Kitchen",from: "#10b981", to: "#059669" },
  { label: "Cameras",    Icon: Camera,     href: "/products?subcategory=Cameras",      from: "#ef4444", to: "#dc2626" },
  { label: "TVs",        Icon: Tv,         href: "/products?subcategory=Televisions",  from: "#06b6d4", to: "#0891b2" },
  { label: "Sports",     Icon: Dumbbell,   href: "/products?category=Sports+%26+Outdoors", from: "#84cc16", to: "#65a30d" },
  { label: "Bags",       Icon: ShoppingBag,href: "/products?subcategory=Bags",         from: "#a855f7", to: "#9333ea" },
  { label: "Offers",     Icon: Zap,        href: "/products?sort=discount",            from: "#f97316", to: "#fbbf24" },
  { label: "Gifts",      Icon: Gift,       href: "/products?sort=rating",              from: "#fb7185", to: "#f43f5e" },
];

export default function PremiumCategories() {
  return (
    <section className="bg-white rounded-3xl shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">Shop by Category</h2>
        <Link href="/products" className="text-sm text-primary font-semibold hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
        {CATS.map(({ label, Icon, href, from, to }) => (
          <Link key={label} href={href} className="group flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center
                         shadow-sm group-hover:scale-110 group-hover:shadow-md
                         transition-all duration-200"
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
            >
              <Icon size={22} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight
                             group-hover:text-primary transition-colors">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
