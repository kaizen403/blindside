import type { LegalPageProps } from "@/app/(legal)/components/LegalPage";

// Final copy delivered by Sara, 2 May 2026.
// Marked as draft via `draftNotice` until Rishi signs off.
// Source: rishi-ai-ops/BUSINESSES/blindwall-legal-pages-final.md
export const refundContent: LegalPageProps = {
  title: "Refund and Cancellation Policy",
  lastUpdated: "May 2, 2026",
  draftNotice:
    "Under review. Final wording may change before sign-off.",
  intro:
    "This Refund and Cancellation Policy applies to purchases of Blindwall services unless a separate written agreement says otherwise.",
  sections: [
    {
      heading: "Cancellations before work starts",
      body: [
        "If you cancel before Blindwall has started work, you may request a refund by emailing rishi@blindwall.tech with your name, contact details, payment reference, and reason for cancellation.",
      ],
    },
    {
      heading: "Cancellations after work starts",
      body: [
        "Once scoping, review, testing, analysis, reporting, or other service work has started, the fee may be partially or fully non-refundable depending on the work already performed.",
      ],
    },
    {
      heading: "Completed services",
      body: [
        "Fees for completed reports, delivered findings, completed testing, or completed re-testing are generally non-refundable.",
      ],
    },
    {
      heading: "Duplicate or failed payments",
      body: [
        "If you believe you were charged twice or a payment failed but money was deducted, email rishi@blindwall.tech with the payment reference. We will verify the transaction and coordinate correction or refund where applicable.",
      ],
    },
    {
      heading: "Processing time",
      body: [
        "Approved refunds are processed through the original payment method where possible. Bank, card, UPI, or payment-gateway timelines may vary.",
      ],
    },
    {
      heading: "Service refusal",
      body: [
        "Blindwall may refuse or cancel a service request if authorization is unclear, the target is out of scope, the request appears unlawful or unsafe, or the customer violates the Terms of Service. If we cancel before meaningful work starts, we may refund the fee after deducting payment-gateway or administrative costs.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "For refund or cancellation questions, email rishi@blindwall.tech.",
      ],
    },
  ],
};
