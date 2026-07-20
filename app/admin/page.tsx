import { Product, Order } from "@/types";
import AdminClient from "./AdminClient";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function getData() {
  const [prodRes, ordRes] = await Promise.all([
    fetch(`${BASE}/api/products`, { next: { revalidate: 0 } }),
    fetch(`${BASE}/api/orders`,   { next: { revalidate: 0 } }),
  ]);
  const products: Product[] = prodRes.ok ? await prodRes.json() : [];
  const orders:   Order[]   = ordRes.ok  ? await ordRes.json()  : [];
  return { products, orders };
}

export default async function AdminPage() {
  const { products, orders } = await getData();
  return <AdminClient initialProducts={products} initialOrders={orders} />;
}
