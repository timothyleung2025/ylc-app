import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Push is not configured." }, { status: 503 });
  const { endpoint } = await request.json();
  if (!endpoint) return NextResponse.json({ error: "Missing endpoint." }, { status: 400 });
  const { error } = await supabase.from("push_subscriptions").update({ is_active: false, updated_at: new Date().toISOString() }).eq("endpoint", endpoint);
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
