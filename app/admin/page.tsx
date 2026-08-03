import { getProducts, getOrders } from "@/lib/data";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [products, orders] = await Promise.all([
    getProducts(),
    getOrders(),
  ]);
  return <AdminClient initialProducts={products} initialOrders={orders} />;
}
