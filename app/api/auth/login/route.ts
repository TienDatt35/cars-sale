import { NextResponse } from "next/server";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
  }

  const token = await signToken();
  const response = NextResponse.json({ ok: true });
  return setAuthCookie(response, token);
}
