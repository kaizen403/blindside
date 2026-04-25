import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import matter from "gray-matter";
import { z } from "zod";
import type { Severity, Stage, StageState } from "@prisma/client";

export const FindingFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
  cvss: z.string().optional(),
  cvssScore: z.number().min(0).max(10).optional(),
  category: z.string().min(1),
  cwe: z.string().optional(),
  asset: z.string().optional(),
  discovered: z.union([z.string(), z.date()]).optional().transform((v) => (v ? (v instanceof Date ? v.toISOString() : v) : undefined)),
  refs: z.array(z.string().url()).optional(),
  remediation: z.string().optional(),
});

export const StageUpdateSchema = z.object({
  stage: z.enum(["SCOPING", "RECON", "SCANNING", "EXPLOITATION", "REPORTING", "REMEDIATION"]),
  state: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "SKIPPED"]),
  note: z.string().optional(),
});

export const ReportFrontmatterSchema = z.object({
  engagement: z.string().min(1),
  report_version: z.number().optional(),
  stage_update: StageUpdateSchema.optional(),
  findings: z.array(FindingFrontmatterSchema).min(1),
});

export type ReportFrontmatter = z.infer<typeof ReportFrontmatterSchema>;
export type FindingFrontmatter = z.infer<typeof FindingFrontmatterSchema>;

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ["className", /^language-./]],
  },
  clobberPrefix: "user-content-",
};

const htmlProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .use(rehypeSanitize as any, sanitizeSchema)
  .use(rehypeStringify);

export async function renderMarkdown(md: string): Promise<string> {
  const result = await htmlProcessor.process(md);
  return String(result);
}

export type ParsedFinding = {
  frontmatter: FindingFrontmatter;
  bodyMarkdown: string;
  bodyHtml: string;
};

export type ParseReportResult =
  | {
      ok: true;
      frontmatter: ReportFrontmatter;
      findings: ParsedFinding[];
      stageUpdate?: {
        stage: Stage;
        state: StageState;
        note?: string;
      };
    }
  | {
      ok: false;
      errors: Array<{ line?: number; message: string; path?: string }>;
    };

export async function parseReport(input: string): Promise<ParseReportResult> {
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(input);
  } catch (e) {
    return {
      ok: false,
      errors: [{ message: `Frontmatter parse failed: ${e instanceof Error ? e.message : String(e)}`, line: 1 }],
    };
  }

  const validation = ReportFrontmatterSchema.safeParse(parsed.data);
  if (!validation.success) {
    return {
      ok: false,
      errors: validation.error.issues.map((i) => ({
        message: i.message,
        path: i.path.join("."),
        line: 1,
      })),
    };
  }
  const frontmatter = validation.data;

  const bodyMd = parsed.content;
  const sections = splitByH2(bodyMd);

  const findings: ParsedFinding[] = [];
  for (const f of frontmatter.findings) {
    const section = sections.find((s) => s.heading.toLowerCase() === f.title.toLowerCase());
    const bodyMarkdown = section?.body ?? "";
    const bodyHtml = await renderMarkdown(bodyMarkdown);
    findings.push({ frontmatter: f, bodyMarkdown, bodyHtml });
  }

  return {
    ok: true,
    frontmatter,
    findings,
    stageUpdate: frontmatter.stage_update,
  };
}

function splitByH2(md: string): { heading: string; body: string }[] {
  const lines = md.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string[] } | null = null;
  for (const line of lines) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) {
      if (current) sections.push({ heading: current.heading, body: current.body.join("\n").trim() });
      current = { heading: match[1], body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push({ heading: current.heading, body: current.body.join("\n").trim() });
  return sections;
}
