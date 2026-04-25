import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UploadEditor } from "./UploadEditor";

export default async function UploadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const engagement = await prisma.engagement.findUnique({ where: { id } });
  if (!engagement) notFound();
  return (
    <div className="space-y-4">
      <Link href={`/admin/engagements/${id}`} className="inline-flex items-center gap-2 text-sm text-[color:var(--muted-foreground)] hover:text-white">
        <ArrowLeft size={14} />
        Back to engagement
      </Link>
      <div>
        <h2 className="font-serif text-3xl">Upload report</h2>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
          Paste markdown with YAML frontmatter. Findings upsert by slug.
        </p>
      </div>
      <UploadEditor engagementId={id} />
    </div>
  );
}
