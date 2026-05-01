import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/outreach"];
const PASSWORD = process.env.OUTREACH_PASSWORD || "blindwall2024";
const COOKIE_NAME = "outreach_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /outreach routes
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Check auth cookie
  const cookie = req.cookies.get(COOKIE_NAME);
  if (cookie?.value === PASSWORD) return NextResponse.next();

  // Handle login POST
  if (req.method === "POST") {
    return NextResponse.next();
  }

  // Show login page
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
    .logo {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      color: #fff;
    }
    .sub {
      font-size: 13px;
      color: #666;
      margin-bottom: 32px;
    }
    label {
      display: block;
      font-size: 12px;
      color: #888;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    input[type="password"] {
      width: 100%;
      padding: 12px 14px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #fff;
      font-size: 15px;
      outline: none;
      transition: border 0.2s;
    }
    input[type="password"]:focus {
      border-color: #444;
    }
    button {
      margin-top: 16px;
      width: 100%;
      padding: 12px;
      background: #fff;
      color: #000;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.9; }
    .error {
      margin-top: 12px;
      font-size: 13px;
      color: #f87171;
      display: none;
    }
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
    const PW = document.getElementById('pw');
    const ERR = document.getElementById('err');
    PW.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
    async function login() {
      const val = PW.value.trim();
      const res = await fetch('/api/outreach/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: val })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        ERR.classList.add('show');
        PW.value = '';
        PW.focus();
      }
    }
  </script>
</body>
</html>`;

  return new NextResponse(loginHtml, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  matcher: ["/outreach/:path*"],
};
