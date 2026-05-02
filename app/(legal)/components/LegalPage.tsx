import Link from "next/link";
import Image from "next/image";

export type LegalSection = {
  heading: string;
  body: string[]; // paragraphs
};

export type LegalPageProps = {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
  draftNotice?: string;
};

export default function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
  draftNotice,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/[0.06] px-6 md:px-28 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Blindwall"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="text-lg font-semibold tracking-tight">
              Blindwall
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-white/50">
            <Link
              href="/terms"
              className="hover:text-white/90 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white/90 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/refund"
              className="hover:text-white/90 transition-colors"
            >
              Refunds
            </Link>
            <Link
              href="/"
              className="hover:text-white/90 transition-colors"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <article className="px-6 md:px-28 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/30 mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-sm text-white/40 font-mono mb-12">
            Last updated: {lastUpdated}
          </p>

          {draftNotice ? (
            <div
              role="note"
              className="mb-10 rounded-lg border border-[#dc2626]/30 bg-[#dc2626]/[0.06] px-5 py-4 text-sm text-white/80 leading-relaxed"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#dc2626] mr-2">
                Draft
              </span>
              {draftNotice}
            </div>
          ) : null}

          {intro ? (
            <p className="text-base text-white/70 leading-relaxed mb-12">
              {intro}
            </p>
          ) : null}

          <div className="flex flex-col gap-10">
            {sections.map((section, i) => (
              <section key={section.heading} id={slugify(section.heading)}>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">
                  {i + 1}. {section.heading}
                </h2>
                <div className="flex flex-col gap-4">
                  {section.body.map((para, pi) => (
                    <p
                      key={pi}
                      className="text-sm md:text-base text-white/65 leading-relaxed"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/[0.06] text-xs text-white/30 font-mono">
            Questions? Contact{" "}
            <a
              href="mailto:rishi@blindwall.tech"
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              rishi@blindwall.tech
            </a>
            .
          </div>
        </div>
      </article>
    </main>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
