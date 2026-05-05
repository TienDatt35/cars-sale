import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED: { method: string; pattern: RegExp }[] = [
  { method: "POST",   pattern: /^\/api\/cars$/ },
  { method: "PUT",    pattern: /^\/api\/cars\/[^/]+$/ },
  { method: "DELETE", pattern: /^\/api\/cars\/[^/]+$/ },
  { method: "PATCH",  pattern: /^\/api\/cars\/[^/]+\/lock$/ },
  { method: "GET",    pattern: /^\/api\/leads/ },
  { method: "PATCH",  pattern: /^\/api\/leads\/[^/]+$/ },
  { method: "PUT",    pattern: /^\/api\/settings$/ },
  { method: "POST",   pattern: /^\/api\/upload$/ },
  { method: "DELETE", pattern: /^\/api\/upload$/ },
];

export async function proxy(request: NextRequest) {
  const { pathname, method } = { pathname: request.nextUrl.pathname, method: request.method };

  const isProtected = PROTECTED.some(
    (rule) => rule.method === method && rule.pattern.test(pathname)
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: "/api/:path*",
};
