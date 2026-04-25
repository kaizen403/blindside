import { requireAdmin } from "@/lib/auth-helpers";
import { EmptyState } from "@/app/dashboard/components/ui/KPI";
import { BookOpen } from "lucide-react";

export default async function LibraryPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl">Library</h2>
      <EmptyState
        icon={<BookOpen size={40} />}
        title="Templates coming"
        description="Reusable finding templates for common OWASP categories will live here."
      />
    </div>
  );
}
