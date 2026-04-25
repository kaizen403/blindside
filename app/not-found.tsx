import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="liquid-glass rounded-2xl p-10 max-w-md text-center">
        <div className="text-[color:var(--muted-foreground)] text-6xl font-serif mb-3">404</div>
        <h1 className="font-serif text-2xl mb-2">Not found</h1>
        <p className="text-sm text-[color:var(--muted-foreground)] mb-6">
          That page drifted off the map.
        </p>
        <Link href="/" className="text-sm text-[color:var(--accent)] hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
