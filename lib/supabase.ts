import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single shared client – safe to import in both client and server components
export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Type helpers aligned with Supabase column names ─────────────
export interface DBProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  original_price: number;
  discount: number;
  rating: number;
  review_count: number;
  stock: number;
  brand: string;
  description: string;
  features: string[];
  images: string[];
  tags: string[];
  created_at: string;
}

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
}

export interface DBOrder {
  id: string;
  user_id: string;
  items: DBOrderItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  address: DBOrderAddress;
  payment_method: string;
  created_at: string;
}

export interface DBOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface DBOrderAddress {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}
