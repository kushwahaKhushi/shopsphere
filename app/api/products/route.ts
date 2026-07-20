import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ── Map DB snake_case → frontend camelCase ──────────────────────
function toProduct(row: any) {
  return {
    id:            row.id,
    name:          row.name,
    category:      row.category,
    subcategory:   row.subcategory,
    price:         row.price,
    originalPrice: row.original_price,
    discount:      row.discount,
    rating:        Number(row.rating),
    reviewCount:   row.review_count,
    stock:         row.stock,
    brand:         row.brand,
    description:   row.description,
    features:      row.features ?? [],
    images:        row.images   ?? [],
    tags:          row.tags     ?? [],
    createdAt:     row.created_at,
  };
}

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  return NextResponse.json((data ?? []).map(toProduct));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, subcategory, price, originalPrice, brand,
            description, features, images, tags, stock } = body;

    if (!name || !category || !price)
      return NextResponse.json({ error: "name, category and price are required" }, { status: 400 });

    const sellingPrice = Number(price);
    const origPrice    = Number(originalPrice) || sellingPrice;
    const discount     = origPrice > sellingPrice
      ? Math.round(((origPrice - sellingPrice) / origPrice) * 100) : 0;

    // Generate a short readable ID
    const id = `p${Date.now().toString(36)}`;

    const { data, error } = await supabase
      .from("products")
      .insert({
        id,
        name:           name.trim(),
        category,
        subcategory:    subcategory || category,
        price:          sellingPrice,
        original_price: origPrice,
        discount,
        stock:          Number(stock) || 50,
        brand:          brand || "Generic",
        description:    description || "",
        features:       Array.isArray(features) ? features : [],
        images:         Array.isArray(images) && images.length
                          ? images
                          : ["https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80"],
        tags:           Array.isArray(tags) ? tags : [],
      })
      .select("*")
      .single();

    if (error || !data)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 });

    return NextResponse.json({ product: toProduct(data) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
