import { NextRequest, NextResponse } from "next/server";

/* =====================================================
   POST /api/auth/login
   Token-based auth with brute-force protection.
   Credentials stored in .env.local (never hardcoded).
   ===================================================== */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function getAttempts(ip: string): number {
  const entry = loginAttempts.get(ip);
  if (!entry) return 0;
  if (Date.now() > entry.resetAt) {
    loginAttempts.delete(ip);
    return 0;
  }
  return entry.count;
}

function recordAttempt(ip: string): void {
  const entry = loginAttempts.get(ip);
  if (!entry || Date.now() > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: Date.now() + LOCKOUT_MS });
  } else {
    entry.count++;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    if (getAttempts(ip) >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans 15 minutes." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Configuration serveur manquante" },
        { status: 500 }
      );
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      recordAttempt(ip);
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    loginAttempts.delete(ip);

    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
