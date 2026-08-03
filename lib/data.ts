/**
 * Server-side data helpers — import ONLY in Server Components / API routes.
 * Queries Supabase directly (no HTTP round-trip to our own API).
 */
import { supabase } from "@/lib/supabase";
import { Product, Order } from "@/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80";

function toProduct(row: any): Product {
  const images: string[] = Array.isArray(row.images) && row.images.length > 0
    ? row.images
    : [FALLBACK_IMAGE];
  return {
    id:            row.id,
    name:          row.name,
    category:      row.category,
    subcategory:   row.subcategory   ?? row.category,
    price:         Number(row.price),
    originalPrice: Number(row.original_price) || Number(row.price),
    discount:      Number(row.discount) || 0,
    rating:        Number(row.rating)   || 4.0,
    reviewCount:   Number(row.review_count) || 0,
    stock:         Number(row.stock)    || 0,
    brand:         row.brand            ?? "Generic",
    description:   row.description     ?? "",
    features:      Array.isArray(row.features) ? row.features : [],
    images,
    tags:          Array.isArray(row.tags)     ? row.tags     : [],
    createdAt:     row.created_at       ?? new Date().toISOString(),
  };
}

function toOrder(row: any): Order {
  return {
    id:            row.id,
    userId:        row.user_id,
    items:         row.items         ?? [],
    total:         Number(row.total),
    status:        row.status        ?? "Processing",
    address:       row.address       ?? {},
    paymentMethod: row.payment_method ?? "UPI",
    createdAt:     row.created_at    ?? new Date().toISOString(),
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts error:", error.message);
    return [];
  }
  return (data ?? []).map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return toProduct(data);
}

export async function getOrders(userId?: string): Promise<Order[]> {
  let q = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (userId) q = q.eq("user_id", userId);

  const { data, error } = await q;
  if (error) {
    console.error("getOrders error:", error.message);
    return [];
  }
  return (data ?? []).map(toOrder);
}
