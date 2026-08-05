import { NextResponse } from "next/server";
import { requestHasAdminToken } from "@/lib/admin-auth";
import { getSupabaseAdminClient, missingSupabaseServerVariables } from "@/lib/supabase/admin";
import type { AnnouncementCategory } from "@/lib/announcement-types";
import { sendAnnouncementPush } from "@/lib/push-notifications";

const categories: AnnouncementCategory[] = ["general", "urgent", "link"];

function validLink(value: unknown) {
  if (typeof value !== "string") return false;
  try { return ["http:", "https:"].includes(new URL(value).protocol); }
  catch { return false; }
}

function context(request: Request) {
  if (!requestHasAdminToken(request)) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    const missing = missingSupabaseServerVariables();
    return {
      error: NextResponse.json(
        {
          error: "Supabase server configuration is incomplete.",
          missing,
        },
        { status: 503 },
      ),
    };
  }
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
  const isLink = body.category === "link";
  const sender = typeof body.sender === "string" ? body.sender.trim().slice(0, 80) || "YLC" : "YLC";
  if (!body.title?.trim() || !categories.includes(body.category) || (isLink ? !validLink(body.link_url) : !body.message?.trim())) return NextResponse.json({ error: isLink ? "Enter a subject and a valid http or https link." : "Complete all announcement fields." }, { status: 400 });
  const { data, error } = await ctx.supabase!.from("announcements").insert({ title: body.title.trim(), message: isLink ? null : body.message.trim(), link_url: isLink ? body.link_url.trim() : null, sender, category: body.category, is_pinned: Boolean(body.is_pinned) }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  let notification = { requested: Boolean(body.send_notification), configured: true, sent: 0, failed: 0 };
  if (body.send_notification) {
    try { notification = { requested: true, ...(await sendAnnouncementPush(data)) }; }
    catch { notification = { requested: true, configured: true, sent: 0, failed: 1 }; }
  }
  return NextResponse.json({ announcement: data, notification }, { status: 201 });
}

export async function PATCH(request: Request) {
  const ctx = context(request);
  if (ctx.error) return ctx.error;
  const body = await request.json();
  if (!body.id || typeof body.is_pinned !== "boolean") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const update: { title?: string; message?: string | null; link_url?: string | null; sender?: string; category?: AnnouncementCategory; is_pinned: boolean } = { is_pinned: body.is_pinned };
  if (body.title !== undefined || body.message !== undefined || body.category !== undefined) {
    const isLink = body.category === "link";
    if (!body.title?.trim() || !categories.includes(body.category) || (isLink ? !validLink(body.link_url) : !body.message?.trim())) return NextResponse.json({ error: isLink ? "Enter a subject and a valid http or https link." : "Complete all announcement fields." }, { status: 400 });
    update.title = body.title.trim();
    update.message = isLink ? null : body.message.trim();
    update.link_url = isLink ? body.link_url.trim() : null;
    update.sender = typeof body.sender === "string" ? body.sender.trim().slice(0, 80) || "YLC" : "YLC";
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
