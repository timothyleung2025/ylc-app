import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "Push is not configured." }, { status: 503 });
  const subscription = await request.json();
  const p256dh = subscription.keys?.p256dh;
  const auth = subscription.keys?.auth;
  if (!subscription.endpoint || !p256dh || !auth) return NextResponse.json({ error: "Invalid push subscription." }, { status: 400 });
  const { error } = await supabase.from("push_subscriptions").upsert({ endpoint: subscription.endpoint, p256dh, auth, user_agent: request.headers.get("user-agent"), updated_at: new Date().toISOString(), is_active: true }, { onConflict: "endpoint" });
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ active: false }, { status: 503 });
  const endpoint = new URL(request.url).searchParams.get("endpoint");
  if (!endpoint) return NextResponse.json({ active: false });
  const { data } = await supabase.from("push_subscriptions").select("is_active").eq("endpoint", endpoint).maybeSingle();
  return NextResponse.json({ active: Boolean(data?.is_active) });
}
