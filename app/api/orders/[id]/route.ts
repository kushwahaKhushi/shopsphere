import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from("orders").select("*").eq("id", params.id).single();

  if (error || !data)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json(toOrder(data));
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  const valid = ["Processing", "Shipped", "Delivered", "Cancelled"];

  if (!valid.includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });

  return NextResponse.json({ order: toOrder(data) });
}
