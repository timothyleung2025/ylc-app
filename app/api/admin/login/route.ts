import { NextResponse } from "next/server";
import {
  adminCodeMatches,
  createAdminToken,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!process.env.ADMIN_ACCESS_CODE) {
    return NextResponse.json(
      { error: "ADMIN_ACCESS_CODE is not configured on the server." },
      { status: 503 },
    );
  }
  const { code } = (await request.json()) as { code?: string };
  if (!code || !adminCodeMatches(code)) {
    return NextResponse.json({ error: "That admin code is not correct." }, { status: 401 });
  }
  return NextResponse.json({ token: createAdminToken() });
}
