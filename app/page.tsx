import { getProducts } from "@/lib/data";
import TrustBar            from "@/components/home/TrustBar";
import HeroSection         from "@/components/home/HeroSection";
import PremiumCategories   from "@/components/home/PremiumCategories";
import DealsBanner         from "@/components/home/DealsBanner";
import FlashSale           from "@/components/home/FlashSale";
import FeaturedCollections from "@/components/FeaturedCollections";
import TrendingProducts    from "@/components/home/TrendingProducts";
import OfferBanners        from "@/components/home/OfferBanners";
import ProductRow          from "@/components/home/ProductRow";
import Brands              from "@/components/home/Brands";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  const electronics = products.filter((p) => p.category === "Electronics");
  const fashion     = products.filter((p) => p.category === "Fashion");
  const topDeals    = [...products].sort((a, b) => b.discount - a.discount).slice(0, 6);
  const topRated    = [...products].sort((a, b) => b.rating   - a.rating  ).slice(0, 6);

  return (
    <div className="pb-12">
      <TrustBar />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 mt-5">
        <HeroSection />
        <PremiumCategories />
        <DealsBanner />
        <FlashSale products={products} />
        <FeaturedCollections />
        <TrendingProducts products={products} />
        <ProductRow title="🔥 Top Deals — Best Discounts"  products={topDeals}    viewAllHref="/products?sort=discount" />
        <OfferBanners />
        <ProductRow title="⚡ Electronics — New Arrivals"   products={electronics} viewAllHref="/products?category=Electronics" />
        <ProductRow title="👗 Fashion Picks"                products={fashion}     viewAllHref="/products?category=Fashion" />
        <ProductRow title="⭐ Top Rated Products"           products={topRated}    viewAllHref="/products?sort=rating" />
        <Brands />
      </div>
    </div>
  );
}
