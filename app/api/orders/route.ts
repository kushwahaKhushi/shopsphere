import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function toOrder(row: any) {
  return {
    id:            row.id,
    userId:        row.user_id,
    items:         row.items,
    total:         row.total,
    status:        row.status,
    address:       row.address,
    paymentMethod: row.payment_method,
    createdAt:     row.created_at,
  };
}

function makeOrderId(): string {
  return `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  return NextResponse.json((data ?? []).map(toOrder));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, items, total, address, paymentMethod } = body;

    if (!items || !total || !address)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const { data, error } = await supabase
      .from("orders")
      .insert({
        id:             makeOrderId(),
        user_id:        userId || null,
        items,
        total:          Number(total),
        status:         "Processing",
        address,
        payment_method: paymentMethod || "UPI",
      })
      .select("*")
      .single();

    if (error || !data)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });

    return NextResponse.json({ order: toOrder(data) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
