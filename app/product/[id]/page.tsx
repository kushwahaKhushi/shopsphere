import { notFound } from "next/navigation";
import { Product } from "@/types";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";
const BASE = process.env.NEXT_PUBLIC_SITE_URL!;

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

export const revalidate = 0;

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const all     = await getAllProducts();
  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
