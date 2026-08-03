import Link from "next/link";

const BRANDS = [
  { name: "Apple",     emoji: "🍎", href: "/products?search=Apple",     color: "from-gray-800 to-gray-600" },
  { name: "Samsung",   emoji: "📱", href: "/products?search=Samsung",   color: "from-blue-700 to-blue-500" },
  { name: "Nike",      emoji: "👟", href: "/products?search=Nike",      color: "from-gray-900 to-gray-700" },
  { name: "Sony",      emoji: "🎧", href: "/products?search=Sony",      color: "from-slate-700 to-slate-500" },
  { name: "Levi's",    emoji: "👖", href: "/products?search=Levis",     color: "from-indigo-700 to-indigo-500" },
  { name: "Canon",     emoji: "📸", href: "/products?search=Canon",     color: "from-red-700 to-red-500" },
  { name: "boAt",      emoji: "🎵", href: "/products?search=boAt",      color: "from-orange-600 to-amber-500" },
  { name: "Xiaomi",    emoji: "📺", href: "/products?search=Xiaomi",    color: "from-rose-600 to-pink-500" },
];

export default function Brands() {
  return (
    <section className="bg-white rounded-3xl shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">Top Brands</h2>
        <Link href="/products" className="text-sm text-primary font-semibold hover:underline">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {BRANDS.map(({ name, emoji, href, color }) => (
          <Link key={name} href={href}
            className="group flex flex-col items-center gap-2.5 p-3.5 rounded-2xl
                       border border-gray-100 hover:border-primary/30
                       hover:bg-primary-50 hover:shadow-sm
                       transition-all duration-150">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color}
                            flex items-center justify-center text-xl shadow-sm
                            group-hover:scale-110 transition-transform duration-200`}>
              {emoji}
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-primary transition-colors text-center">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
