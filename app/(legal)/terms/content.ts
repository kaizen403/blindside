import type { LegalPageProps } from "@/app/(legal)/components/LegalPage";

// Final copy delivered by Sara, 2 May 2026.
// Marked as draft via `draftNotice` until Rishi signs off.
// Source: rishi-ai-ops/BUSINESSES/blindwall-legal-pages-final.md
export const termsContent: LegalPageProps = {
  title: "Terms of Service",
  lastUpdated: "May 2, 2026",
  draftNotice:
    "Under review. Final wording may change before sign-off.",
  intro:
    'These Terms of Service ("Terms") govern your access to https://blindwall.tech and your use of Blindwall\'s security testing and vulnerability review services. By using our website, contacting us, or purchasing a service, you agree to these Terms.',
  sections: [
    {
      heading: "Services",
      body: [
        "Blindwall provides practical security review services for websites, applications, APIs, and infrastructure. Services may include attack-surface review, vulnerability scanning, validation of findings, severity classification, reporting, and re-testing where agreed.",
        "The exact scope, target assets, timelines, deliverables, and rules of engagement will be agreed in writing before testing begins.",
      ],
    },
    {
      heading: "Authorization and scope",
      body: [
        "You must own, control, or have written authorization to test every asset you submit to Blindwall. You must not request testing of any system, account, network, application, API, or infrastructure that you are not authorized to test.",
        "Blindwall will perform testing only within the agreed scope. We may refuse, pause, or stop work if authorization is unclear, if scope is unsafe or unlawful, or if continuing may create unacceptable risk.",
      ],
    },
    {
      heading: "Customer responsibilities",
      body: [
        "You are responsible for: providing accurate contact, billing, and target-asset information; confirming testing authorization and scope in writing; backing up systems before testing where appropriate; telling us about fragile systems, restricted windows, sensitive environments, or prohibited test types; reviewing reports and applying fixes; and handling your systems, users, customer data, and records lawfully.",
      ],
    },
    {
      heading: "No guarantee of complete security",
      body: [
        "Security testing reduces risk but cannot guarantee that every vulnerability will be found or that your systems are completely secure. Reports reflect findings from the agreed scope, methods, access, and time period. New vulnerabilities, configuration changes, third-party issues, or missed issues may still exist. A Blindwall report is not a certification of security unless we explicitly say so in writing.",
      ],
    },
    {
      heading: "Reports and deliverables",
      body: [
        "Reports are provided for your internal security and remediation use. You may share a report with employees, contractors, auditors, insurers, investors, or customers where there is a legitimate business need. You must not alter findings in a misleading way or claim certification unless Blindwall provides one in writing.",
      ],
    },
    {
      heading: "Fees and payment",
      body: [
        "Fees are shown on the website or agreed separately. Blindwall currently advertises starting protection for startups and growing businesses at ₹999. Taxes, payment-gateway charges, or additional services may apply.",
        "Work begins only after payment or written confirmation, depending on the engagement.",
      ],
    },
    {
      heading: "Refunds and cancellations",
      body: [
        "Refunds and cancellations are governed by the separate Refund and Cancellation Policy, unless a written agreement says otherwise.",
      ],
    },
    {
      heading: "Acceptable use",
      body: [
        "You must not use Blindwall's website or services to: conduct unauthorized testing, scanning, exploitation, or surveillance; target third-party systems without permission; obtain malware, exploit code, credentials, or instructions for misuse; interfere with Blindwall's website, systems, or service providers; submit illegal, harmful, or misleading information; or violate applicable law or third-party rights.",
      ],
    },
    {
      heading: "Confidentiality",
      body: [
        "Each party may receive confidential information from the other. Confidential information must be used only for the engagement and protected with reasonable care. This does not apply to information that is public, independently developed, lawfully received from another source, or required to be disclosed by law.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "Blindwall retains ownership of its website, brand, methods, templates, tools, know-how, and pre-existing materials. You retain ownership of your systems, data, and materials. Subject to payment, Blindwall grants you a non-exclusive license to use the final report and deliverables for internal business, security, compliance, and remediation purposes.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the maximum extent permitted by law, Blindwall will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost revenue, loss of goodwill, loss of data, downtime, or business interruption.",
        "To the maximum extent permitted by law, Blindwall's total liability for any claim relating to the website or services will not exceed the amount you paid Blindwall for the specific service giving rise to the claim.",
      ],
    },
    {
      heading: "Indemnity",
      body: [
        "You agree to defend, indemnify, and hold Blindwall harmless from claims, losses, liabilities, damages, costs, and expenses arising from your breach of these Terms, inaccurate authorization, unlawful testing requests, misuse of reports, or violation of third-party rights.",
      ],
    },
    {
      heading: "Changes",
      body: [
        'We may update these Terms from time to time. Updates will be posted on this page with a revised "Last updated" date. Continued use after changes means you accept the updated Terms.',
      ],
    },
    {
      heading: "Contact",
      body: ["For questions about these Terms, email rishi@blindwall.tech."],
    },
  ],
};
