import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/tracks/links - list all links
// POST /api/tracks/links - create a new link { slug, label?, redirectUrl? }
export async function GET() {
  const links = await prisma.trackLink.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { hits: true } } },
  });
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const { slug, label, redirectUrl } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const link = await prisma.trackLink.create({
    data: { slug, label, redirectUrl: redirectUrl || "https://blindwall.tech" },
  });
  return NextResponse.json(link);
}
