import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

interface Props {
  title: string;
  products: Product[];
  viewAllHref: string;
}

export default function ProductRow({ title, products, viewAllHref }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-base font-bold text-gray-800 border-l-4 border-primary pl-2">
          {title}
        </h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
        >
          View All <ChevronRight size={14} />
        </Link>
      </div>

      {/* Product grid */}
      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
