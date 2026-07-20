import { notFound } from "next/navigation";
import { Product } from "@/types";
import ProductDetailClient from "./ProductDetailClient";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE}/api/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE}/api/products`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  // pre-render common products at build time
  const products = await getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const all     = await getAllProducts();
  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
