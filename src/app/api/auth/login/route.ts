import { NextRequest, NextResponse } from "next/server";

/* =====================================================
   POST /api/auth/login
   Simple token-based auth. In production, use Supabase
   Auth or a proper JWT library.
   ===================================================== */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@amm-dz.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "amm-admin-2024";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

    const response = NextResponse.json({ success: true }, { status: 200 });

    // Set httpOnly cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
