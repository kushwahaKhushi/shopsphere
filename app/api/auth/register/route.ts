import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const cleanEmail = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", cleanEmail)
      .limit(1);

    if (existing && existing.length > 0)
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

    // Insert new user — Supabase generates the UUID automatically
    const { data: inserted, error } = await supabase
      .from("users")
      .insert({ name: name.trim(), email: cleanEmail, password, role: "user" })
      .select("id, name, email, role")
      .single();

    if (error || !inserted)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });

    return NextResponse.json({ user: inserted }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
