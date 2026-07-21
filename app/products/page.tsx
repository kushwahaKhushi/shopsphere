import { Suspense } from "react";
import { Product } from "@/types";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";
async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-gray-500">
          Loading products…
        </div>
      }
    >
      <ProductsClient products={products} />
    </Suspense>
  );
}