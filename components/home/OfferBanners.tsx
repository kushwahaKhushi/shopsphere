import Link from "next/link";

const banners = [
  {
    title: "Upgrade Your Style",
    sub: "Flat 37% off on Fashion",
    href: "/products?category=Fashion",
    bg: "from-pink-600 to-rose-500",
    emoji: "👗",
  },
  {
    title: "Sports & Outdoors",
    sub: "Gear up for adventure",
    href: "/products?category=Sports+%26+Outdoors",
    bg: "from-teal-600 to-green-500",
    emoji: "🏕️",
  },
  {
    title: "Photography Deals",
    sub: "DSLR cameras from ₹34,990",
    href: "/products?subcategory=Cameras",
    bg: "from-orange-600 to-yellow-500",
    emoji: "📸",
  },
];

export default function OfferBanners() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {banners.map((b) => (
        <Link
          key={b.title}
          href={b.href}
          className={`bg-gradient-to-br ${b.bg} rounded-lg p-5 flex items-center gap-4 hover:opacity-90 transition-opacity shadow-sm`}
        >
          <span className="text-4xl">{b.emoji}</span>
          <div>
            <p className="text-white font-bold text-base">{b.title}</p>
            <p className="text-white/80 text-sm">{b.sub}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
