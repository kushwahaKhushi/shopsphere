import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    // Query users table — plain text password match (no Supabase Auth per spec)
    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("email", email.toLowerCase().trim())
      .eq("password", password)
      .limit(1);

    if (error)
      return NextResponse.json({ error: "Database error" }, { status: 500 });

    if (!users || users.length === 0)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    return NextResponse.json({ user: users[0] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
