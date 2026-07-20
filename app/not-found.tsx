import Link from "next/link";
import { SearchX, Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
            <SearchX size={48} className="text-primary" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary justify-center py-3">
            <Home size={16} /> Go Home
          </Link>
          <Link href="/products" className="btn-outline justify-center py-3">
            <ShoppingBag size={16} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
