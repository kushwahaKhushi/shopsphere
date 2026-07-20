import Link from "next/link";
import {
  Smartphone, Laptop, Headphones, ShirtIcon, Watch, Home,
  Camera, Tv, Dumbbell, ShoppingBag, Zap, Gift,
} from "lucide-react";

const categories = [
  { label: "Mobiles",    icon: Smartphone,  href: "/products?subcategory=Smartphones",       color: "bg-teal-50    text-teal-700"    },
  { label: "Laptops",    icon: Laptop,      href: "/products?subcategory=Laptops",             color: "bg-emerald-50 text-emerald-700" },
  { label: "Audio",      icon: Headphones,  href: "/products?subcategory=Audio",               color: "bg-purple-50  text-purple-600"  },
  { label: "Fashion",    icon: ShirtIcon,   href: "/products?category=Fashion",                color: "bg-pink-50    text-pink-600"    },
  { label: "Watches",    icon: Watch,       href: "/products?subcategory=Watches",             color: "bg-orange-50  text-orange-600"  },
  { label: "Home",       icon: Home,        href: "/products?category=Home+%26+Kitchen",       color: "bg-green-50   text-green-700"   },
  { label: "Cameras",    icon: Camera,      href: "/products?subcategory=Cameras",             color: "bg-red-50     text-red-600"     },
  { label: "TVs",        icon: Tv,          href: "/products?subcategory=Televisions",         color: "bg-cyan-50    text-cyan-700"    },
  { label: "Sports",     icon: Dumbbell,    href: "/products?category=Sports+%26+Outdoors",    color: "bg-lime-50    text-lime-700"    },
  { label: "Bags",       icon: ShoppingBag, href: "/products?subcategory=Bags",                color: "bg-yellow-50  text-yellow-700"  },
  { label: "Offers",     icon: Zap,         href: "/products?sort=discount",                   color: "bg-amber-50   text-amber-600"   },
  { label: "Gift Ideas", icon: Gift,        href: "/products?sort=rating",                     color: "bg-rose-50    text-rose-600"    },
];

export default function CategoryGrid() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="section-title mb-4">Shop by Category</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3">
        {categories.map(({ label, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-sm`}>
              <Icon size={22} />
            </div>
            <span className="text-[11px] text-gray-600 font-medium text-center leading-tight group-hover:text-primary transition-colors">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
