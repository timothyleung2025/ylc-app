import { NextResponse } from "next/server";
import { requestHasAdminToken } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AnnouncementCategory } from "@/lib/announcement-types";
import { sendAnnouncementPush } from "@/lib/push-notifications";

const categories: AnnouncementCategory[] = ["general", "reminder", "schedule_update", "urgent"];

function context(request: Request) {
  if (!requestHasAdminToken(request)) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { error: NextResponse.json({ error: "Supabase server credentials are missing." }, { status: 503 }) };
  return { supabase };
}

export async function GET(request: Request) {
  const ctx = context(request);
  if (ctx.error) return ctx.error;
  const { data, error } = await ctx.supabase!.from("announcements").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json(data);
}

export async function POST(request: Request) {
  const ctx = context(request);
  if (ctx.error) return ctx.error;
  const body = await request.json();
  if (!body.title?.trim() || !body.message?.trim() || !categories.includes(body.category)) return NextResponse.json({ error: "Complete all announcement fields." }, { status: 400 });
  const { data, error } = await ctx.supabase!.from("announcements").insert({ title: body.title.trim(), message: body.message.trim(), category: body.category, is_pinned: Boolean(body.is_pinned) }).select().single();
  if (!error && data) await sendAnnouncementPush(data);
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  const ctx = context(request);
  if (ctx.error) return ctx.error;
  const body = await request.json();
  if (!body.id || typeof body.is_pinned !== "boolean") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const update: { title?: string; message?: string; category?: AnnouncementCategory; is_pinned: boolean } = { is_pinned: body.is_pinned };
  if (body.title !== undefined || body.message !== undefined || body.category !== undefined) {
    if (!body.title?.trim() || !body.message?.trim() || !categories.includes(body.category)) return NextResponse.json({ error: "Complete all announcement fields." }, { status: 400 });
    update.title = body.title.trim();
    update.message = body.message.trim();
    update.category = body.category;
  }
  const { data, error } = await ctx.supabase!.from("announcements").update(update).eq("id", body.id).select().single();
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const ctx = context(request);
  if (ctx.error) return ctx.error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing announcement id." }, { status: 400 });
  const { error } = await ctx.supabase!.from("announcements").delete().eq("id", id);
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
