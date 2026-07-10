import { NextRequest, NextResponse } from "next/server";

function isValidAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 2) return false;
    const timestamp = parseInt(parts[parts.length - 1], 10);
    if (isNaN(timestamp)) return false;
    const MAX_AGE_MS = 24 * 60 * 60 * 1000;
    return Date.now() - timestamp < MAX_AGE_MS;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;
    if (!token || !isValidAdminToken(token)) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      if (token) response.cookies.delete("admin_token");
      return response;
    }
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;
    if (token && isValidAdminToken(token)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const response = NextResponse.next();
    if (token && !isValidAdminToken(token)) {
      response.cookies.delete("admin_token");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
