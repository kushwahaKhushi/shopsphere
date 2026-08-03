import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

interface Props {
  title:       string;
  products:    Product[];
  viewAllHref: string;
}

export default function ProductRow({ title, products, viewAllHref }: Props) {
  if (!products.length) return null;

  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="section-title">{title}</h2>
          <Link href={viewAllHref}
            className="flex items-center gap-1 text-sm text-primary font-semibold
                       hover:underline underline-offset-2">
            View All <ArrowRight size={14} />
          </Link>
        </div>
      )}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
