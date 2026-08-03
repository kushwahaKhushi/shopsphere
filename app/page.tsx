import { Product } from "@/types";
import HeroSection    from "@/components/home/HeroSection";
import CategoryGrid   from "@/components/home/CategoryGrid";
import DealsBanner    from "@/components/home/DealsBanner";
import ProductRow     from "@/components/home/ProductRow";
import TrustBar       from "@/components/home/TrustBar";
import OfferBanners   from "@/components/home/OfferBanners";

export const dynamic = "force-dynamic";
// Fetch products from our own API (which reads from Supabase)
async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  const electronics = products.filter((p) => p.category === "Electronics");
  const fashion     = products.filter((p) => p.category === "Fashion");
  const topDeals    = [...products].sort((a, b) => b.discount  - a.discount ).slice(0, 6);
  const topRated    = [...products].sort((a, b) => b.rating    - a.rating   ).slice(0, 6);

  return (
    <div className="pb-8">
      <TrustBar />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-4 mt-3">
        <HeroSection />
        <CategoryGrid />
        <DealsBanner />
        <ProductRow title="🔥 Top Deals — Best Discounts"      products={topDeals}    viewAllHref="/products?sort=discount"  />
        <OfferBanners />
        <ProductRow title="⚡ Electronics — New Arrivals"       products={electronics} viewAllHref="/products?category=Electronics" />
        <ProductRow title="👗 Fashion Picks"                    products={fashion}     viewAllHref="/products?category=Fashion" />
        <ProductRow title="⭐ Top Rated Products"               products={topRated}    viewAllHref="/products?sort=rating"    />
      </div>
    </div>
  );
}
