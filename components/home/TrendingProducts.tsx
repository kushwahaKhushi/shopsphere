import { TrendingUp } from "lucide-react";
import { Product }    from "@/types";
import ProductRow     from "@/components/home/ProductRow";

export default function TrendingProducts({ products }: { products: Product[] }) {
  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);
  if (!trending.length) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark
                        flex items-center justify-center shadow-sm">
          <TrendingUp size={18} className="text-white" />
        </div>
        <div>
          <h2 className="font-black text-xl text-gray-900 leading-tight">Trending Now</h2>
          <p className="text-sm text-gray-400">Most popular this week</p>
        </div>
      </div>
      <ProductRow title="" products={trending} viewAllHref="/products?sort=rating" />
    </section>
  );
}
