import type { LegalPageProps } from "@/app/(legal)/components/LegalPage";

// Final copy delivered by Sara, 2 May 2026.
// Marked as draft via `draftNotice` until Rishi signs off.
// Source: rishi-ai-ops/BUSINESSES/blindwall-legal-pages-final.md
export const privacyContent: LegalPageProps = {
  title: "Privacy Policy",
  lastUpdated: "May 2, 2026",
  draftNotice:
    "Under review. Final wording may change before sign-off.",
  intro:
    'Blindwall ("Blindwall", "we", "us", "our") provides practical security testing and vulnerability review for websites, applications, APIs, and related infrastructure. This Privacy Policy explains what information we collect, how we use it, and how we protect it when you visit https://blindwall.tech, contact us, or use our services.',
  sections: [
    {
      heading: "Information we collect",
      body: [
        "Contact information: name, email, company, phone number, and any message you send us.",
        "Service information: target asset details (website, app, API, infrastructure), agreed scope, rules of engagement, screenshots, vulnerability findings, and remediation notes.",
        "Payment information: payment status, order details, transaction references, and invoice records. We do not intentionally store full card, UPI, or bank credentials. Payment processing may be handled by third-party providers.",
        "Technical information: IP address, browser type, device information, pages visited, timestamps, and diagnostic or security logs generated when you use our website or when we perform agreed testing.",
        "Please do not submit passwords, production secrets, private keys, or customer records unless we specifically ask for them as part of a clearly defined service.",
      ],
    },
    {
      heading: "How we use information",
      body: [
        "We use information to:",
        "respond to inquiries and provide support; scope engagements and define rules of engagement; perform authorized security testing within agreed scope; prepare reports, risk summaries, and remediation recommendations; process payments, invoices, and service records; improve our website, services, and internal operations; prevent fraud, abuse, and unauthorized testing; and comply with applicable legal obligations.",
      ],
    },
    {
      heading: "Security testing data",
      body: [
        "Testing involves technical details about your systems. We treat all testing data and findings as confidential and use them only to deliver the requested service, unless you give written permission for another use or disclosure is required by law.",
        "You are responsible for confirming that you have the authority to request testing of every target asset you submit. We may refuse, pause, or stop testing if ownership or authorization is unclear.",
      ],
    },
    {
      heading: "Sharing information",
      body: [
        "We do not sell personal information. We may share information with service providers (hosting, analytics, payment processing, email, documentation, operational tooling); professional advisers where necessary; law enforcement, regulators, or courts when legally required; and another party if Blindwall is involved in a merger, acquisition, or similar business transfer.",
        "Where practical, we limit shared information to what is necessary.",
      ],
    },
    {
      heading: "Data retention",
      body: [
        "We keep information only as long as reasonably necessary for the purposes above, including service delivery, security, accounting, legal, and operational needs. Reports and related working notes may be retained for re-testing, audit, or dispute handling unless deletion is requested and we are legally and operationally able to delete them.",
      ],
    },
    {
      heading: "Security",
      body: [
        "We use reasonable technical and organizational measures to protect information. No website, email system, or internet transmission is completely secure. Avoid sending highly sensitive information through unsecured channels.",
      ],
    },
    {
      heading: "Your choices and rights",
      body: [
        "Depending on applicable law, you may request access, correction, deletion, or restriction of your personal information. To make a request, email rishi@blindwall.tech. We may need to verify your identity before acting on it.",
      ],
    },
    {
      heading: "Third-party links and services",
      body: [
        "Our website and communications may link to third-party websites or use third-party tools. Their privacy practices are governed by their own policies, not this Privacy Policy.",
      ],
    },
    {
      heading: "Children's privacy",
      body: [
        "Our services are intended for businesses and adults. We do not knowingly collect personal information from children.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        'We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last updated" date.',
      ],
    },
    {
      heading: "Contact",
      body: ["For privacy questions, email rishi@blindwall.tech."],
    },
  ],
};
