import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const ok = await isAdminRequest(request);
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
