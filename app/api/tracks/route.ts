import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const hits = await prisma.trackHit.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { link: { select: { slug: true, label: true } } },
  });
  return NextResponse.json(hits);
}
