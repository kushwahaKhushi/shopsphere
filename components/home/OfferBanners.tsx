import Link from "next/link";

const BANNERS = [
  {
    title: "Upgrade Your Style",
    sub:   "Flat 37% off on all Fashion",
    href:  "/products?category=Fashion",
    bg:    "from-[#be185d] to-[#ec4899]",
    emoji: "👗",
    tag:   "Fashion",
  },
  {
    title: "Sports & Outdoors",
    sub:   "Gear up for your next adventure",
    href:  "/products?category=Sports+%26+Outdoors",
    bg:    "from-[#065f46] to-[#059669]",
    emoji: "🏕️",
    tag:   "Sports",
  },
  {
    title: "Photography Deals",
    sub:   "DSLR cameras from ₹34,990",
    href:  "/products?subcategory=Cameras",
    bg:    "from-[#92400e] to-[#f97316]",
    emoji: "📸",
    tag:   "Cameras",
  },
];

export default function OfferBanners() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {BANNERS.map(({ title, sub, href, bg, emoji, tag }) => (
        <Link key={title} href={href}
          className={`group relative bg-gradient-to-br ${bg}
                      rounded-2xl p-6 flex items-center gap-4 overflow-hidden
                      hover:scale-[1.02] hover:shadow-card-lg
                      transition-all duration-200 shadow-card`}>
          {/* Decorative circle */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10" />

          <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-200">
            {emoji}
          </span>
          <div className="relative z-10">
            <span className="inline-block bg-white/20 text-white text-[10px] font-black
                             px-2 py-0.5 rounded-full mb-2 tracking-widest uppercase">
              {tag}
            </span>
            <p className="text-white font-black text-base leading-tight">{title}</p>
            <p className="text-white/75 text-sm mt-0.5">{sub}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
