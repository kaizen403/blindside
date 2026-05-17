import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UAParser } from "ua-parser-js";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await prisma.trackLink.findUnique({ where: { slug } });
  if (!link) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Get IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Parse UA
  const uaString = req.headers.get("user-agent") || "";
  const ua = new UAParser(uaString);
  const browser = ua.getBrowser().name || null;
  const os = ua.getOS().name || null;
  const device = ua.getDevice().type || "desktop";

  // Geo lookup
  let city: string | null = null,
    region: string | null = null,
    country: string | null = null,
    lat: number | null = null,
    lon: number | null = null,
    isp: string | null = null;

  try {
    const geo = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "blindwall-tracker/1.0" },
    }).then((r) => r.json());
    city = geo.city || null;
    region = geo.region || null;
    country = geo.country_name || null;
    lat = geo.latitude || null;
    lon = geo.longitude || null;
    isp = geo.org || null;
  } catch {}

  await prisma.trackHit.create({
    data: {
      linkId: link.id,
      ip,
      city,
      region,
      country,
      lat,
      lon,
      isp,
      userAgent: uaString.slice(0, 500),
      device,
      browser,
      os,
      referer: req.headers.get("referer") || null,
    },
  });

  return NextResponse.redirect(link.redirectUrl);
}
