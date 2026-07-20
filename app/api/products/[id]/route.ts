import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("products").select("*").eq("id", params.id).single();

  if (error || !data)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json(toProduct(data));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const sellingPrice = Number(body.price);
    const origPrice    = Number(body.originalPrice) || sellingPrice;
    const discount     = origPrice > sellingPrice
      ? Math.round(((origPrice - sellingPrice) / origPrice) * 100) : 0;

    const { data, error } = await supabase
      .from("products")
      .update({
        name:           body.name,
        category:       body.category,
        subcategory:    body.subcategory,
        price:          sellingPrice,
        original_price: origPrice,
        discount,
        stock:          Number(body.stock),
        brand:          body.brand,
        description:    body.description,
        features:       body.features,
        images:         body.images,
        tags:           body.tags,
      })
      .eq("id", params.id)
      .select("*")
      .single();

    if (error || !data)
      return NextResponse.json({ error: "Failed to update product" }, { status: 500 });

    return NextResponse.json({ product: toProduct(data) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from("products").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  return NextResponse.json({ message: "Deleted" });
}
