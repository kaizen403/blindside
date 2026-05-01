import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.OUTREACH_PASSWORD || "blindwall2024";
const COOKIE_NAME = "outreach_auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, PASSWORD, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return res;
}
