import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/app", "/admin"];
const AUTH_ROUTES = ["/onboard"];
const OUTREACH_ROUTES = ["/outreach"];
const OUTREACH_COOKIE = "outreach_auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Password-protect /outreach
  const isOutreach = OUTREACH_ROUTES.some((p) => pathname.startsWith(p));
  if (isOutreach) {
    const password = process.env.OUTREACH_PASSWORD || "blindwall2024";
    const cookie = request.cookies.get(OUTREACH_COOKIE);
    if (cookie?.value !== password) {
      const loginHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blindwall — Login</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0a0a;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: #111;
      border: 1px solid #222;
      border-radius: 12px;
      padding: 40px;
      width: 360px;
    }
    .logo { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
    .sub { font-size: 13px; color: #666; margin-bottom: 32px; }
    label { display: block; font-size: 12px; color: #888; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    input[type="password"] {
      width: 100%; padding: 12px 14px;
      background: #1a1a1a; border: 1px solid #2a2a2a;
      border-radius: 8px; color: #fff; font-size: 15px; outline: none;
    }
    input[type="password"]:focus { border-color: #444; }
    button {
      margin-top: 16px; width: 100%; padding: 12px;
      background: #fff; color: #000; border: none;
      border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
    }
    button:hover { opacity: 0.9; }
    .error { margin-top: 12px; font-size: 13px; color: #f87171; display: none; }
    .error.show { display: block; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Blindwall</div>
    <div class="sub">Outreach Dashboard</div>
    <label>Password</label>
    <input type="password" id="pw" placeholder="Enter password" autofocus />
    <button onclick="login()">Access Dashboard</button>
    <div class="error" id="err">Incorrect password</div>
  </div>
  <script>
    document.getElementById('pw').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
    async function login() {
      const val = document.getElementById('pw').value.trim();
      const res = await fetch('/api/outreach/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: val })
      });
      if (res.ok) { window.location.reload(); }
      else { document.getElementById('err').classList.add('show'); document.getElementById('pw').value = ''; document.getElementById('pw').focus(); }
    }
  </script>
</body>
</html>`;
      return new NextResponse(loginHtml, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    }
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isProtected = PROTECTED_ROUTES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (isProtected && !sessionToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/outreach/:path*", "/((?!api/auth|api/webhooks|api/outreach/track|_next/static|_next/image|favicon.ico|public).*)"],
};
