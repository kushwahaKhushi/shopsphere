import Link from "next/link";
import Image from "next/image";

const COLLECTIONS = [
  {
    title:   "Premium Electronics",
    sub:     "Gadgets that change the way you work & play",
    tag:     "Up to 40% off",
    href:    "/products?category=Electronics",
    bg:      "from-[#0d3d39] to-[#1a6b64]",
    img:     "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
    emoji:   "💻",
  },
  {
    title:   "Fashion Trends",
    sub:     "Dress to impress — new styles every week",
    tag:     "New Arrivals",
    href:    "/products?category=Fashion",
    bg:      "from-[#831843] to-[#be185d]",
    img:     "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
    emoji:   "👗",
  },
  {
    title:   "Home Essentials",
    sub:     "Beautiful home, beautiful life",
    tag:     "Starting ₹299",
    href:    "/products?category=Home+%26+Kitchen",
    bg:      "from-[#064e3b] to-[#065f46]",
    img:     "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80",
    emoji:   "🏡",
  },
];

export default function FeaturedCollections() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Featured Collections</h2>
        <Link href="/products" className="text-sm text-primary font-semibold hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLLECTIONS.map(({ title, sub, tag, href, bg, img, emoji }) => (
          <Link key={title} href={href}
            className="group relative bg-gradient-to-br rounded-3xl overflow-hidden
                       shadow-card hover:shadow-card-lg hover:scale-[1.02]
                       transition-all duration-250 min-h-[200px]"
            style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
          >
            {/* Gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bg}`} />

            {/* Background image */}
            <div className="absolute inset-0">
              <Image src={img} alt={title} fill className="object-cover opacity-20" unoptimized />
            </div>

            {/* Decorative circle */}
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />

            {/* Content */}
            <div className="relative z-10 p-7 flex flex-col h-full min-h-[200px] justify-between">
              <div>
                <span className="inline-block bg-white/20 text-white text-[11px] font-black
                                 px-3 py-1 rounded-full mb-4 tracking-widest uppercase
                                 border border-white/10">
                  {tag}
                </span>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200 w-fit">
                  {emoji}
                </div>
                <h3 className="text-white font-black text-xl leading-tight">{title}</h3>
                <p className="text-white/70 text-sm mt-1.5 leading-relaxed">{sub}</p>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25
                              text-white text-sm font-bold px-4 py-2.5 rounded-xl
                              border border-white/10 transition-colors w-fit">
                Shop Now →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
