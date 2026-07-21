import { Product, Order } from "@/types";
import AdminClient from "./AdminClient";
export const dynamic = "force-dynamic";
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function getData() {
  const [prodRes, ordRes] = await Promise.all([
    fetch(`${BASE}/api/products`, { cache: "no-store" }),
   fetch(`${BASE}/api/orders`, { cache: "no-store" }),
  ]);
  const products: Product[] = prodRes.ok ? await prodRes.json() : [];
  const orders:   Order[]   = ordRes.ok  ? await ordRes.json()  : [];
  return { products, orders };
}

export default async function AdminPage() {
  const { products, orders } = await getData();
  return <AdminClient initialProducts={products} initialOrders={orders} />;
}
