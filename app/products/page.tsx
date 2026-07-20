import { Suspense } from "react";
import { Product } from "@/types";
import ProductsClient from "./ProductsClient";

async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading products…</div>}>
      <ProductsClient products={products} />
    </Suspense>
  );
}
