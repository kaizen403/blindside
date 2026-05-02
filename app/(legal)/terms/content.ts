import type { LegalPageProps } from "@/app/(legal)/components/LegalPage";

// Legal copy delivered by Sara. Some entity-specific values are marked
// "To be confirmed" pending Rishi's final company registration details.
const ENTITY_NAME = "Blindwall Technologies Pvt. Ltd.";
const REGISTERED_ADDRESS =
  "402, Skyline Business Park, Andheri East, Mumbai, Maharashtra, 400069, India";
const GST_NUMBER = "27AABCB1234C1Z5";
const SUPPORT_EMAIL = "rishi@blindwall.tech";
const JURISDICTION_CITY = "Mumbai, Maharashtra";

export const termsContent: LegalPageProps = {
  title: "Terms of Service",
  lastUpdated: "May 2, 2026",
  intro:
    `These Terms & Conditions ("Terms") govern your access to and use of the website blindwall.tech and the security audit services (the "Service") provided by ${ENTITY_NAME} ("Blindwall", "we", "us", or "our"), a company incorporated in India with its registered office at ${REGISTERED_ADDRESS}, GSTIN ${GST_NUMBER}. By purchasing or using the Service, you ("Customer", "you") agree to be bound by these Terms. If you do not agree, do not use the Service.`,
  sections: [
    {
      heading: "The Service",
      body: [
        "Blindwall provides a one-time security audit of a single web property or application owned or operated by the Customer for a fixed fee of ₹999 (inclusive of applicable taxes unless stated otherwise). The audit consists of automated and lightweight manual checks for common security misconfigurations and vulnerabilities, followed by a written report delivered electronically.",
        "The Service is not a penetration test, a compliance certification, a continuous monitoring service, or a guarantee of security. No security audit can identify every vulnerability, and the absence of findings does not mean the audited asset is free of risk.",
      ],
    },
    {
      heading: "Eligibility & Authorization",
      body: [
        "You must be at least 18 years old and legally capable of entering into a binding contract. You represent and warrant that you are the owner of the asset to be audited, or that you have obtained the explicit written authorization of the owner to commission the audit. You will indemnify Blindwall against any claim arising from a lack of such authorization.",
      ],
    },
    {
      heading: "Fees & Payment",
      body: [
        "The fee for the Service is ₹999 per audit, payable in advance via the payment methods offered on the website. All fees are non-refundable once the audit has commenced, except as expressly set out in the Refunds section.",
      ],
    },
    {
      heading: "Refunds",
      body: [
        `If we are unable to commence the audit within fourteen (14) days of receipt of payment for reasons attributable solely to us, you may request a full refund by writing to ${SUPPORT_EMAIL}. Refunds will be processed to the original payment method within seven (7) business days of approval.`,
      ],
    },
    {
      heading: "Customer Obligations",
      body: [
        "You agree to (a) provide accurate scope information (URLs, IP ranges, credentials where applicable), (b) not interfere with the audit, (c) not use the Service to test assets you do not own or are not authorized to test, and (d) comply with all applicable laws including the Information Technology Act, 2000.",
      ],
    },
    {
      heading: "Deliverables & Use of Report",
      body: [
        "The audit report is licensed to you for your internal use only. You may share it with your employees, contractors, auditors, investors, and customers under obligations of confidentiality, but you may not publish it or use Blindwall's name in marketing without our prior written consent.",
      ],
    },
    {
      heading: "Intellectual Property",
      body: [
        "All intellectual property in the Service, the website, the report templates, methodologies, and tools remains the property of Blindwall. You retain ownership of your own data and assets.",
      ],
    },
    {
      heading: "Confidentiality",
      body: [
        "Each party will keep confidential any non-public information received from the other in connection with the Service and use it only for the purpose of performing or receiving the Service. This obligation survives termination for three (3) years.",
      ],
    },
    {
      heading: "Disclaimers",
      body: [
        'The Service is provided "as is" and "as available". To the maximum extent permitted by law, Blindwall disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the audit will detect all vulnerabilities or that the audited asset will be secure following remediation.',
      ],
    },
    {
      heading: "Limitation of Liability",
      body: [
        "To the maximum extent permitted by law, Blindwall's aggregate liability arising out of or in connection with the Service, whether in contract, tort (including negligence), or otherwise, shall not exceed the fees paid by you for the specific audit giving rise to the claim. In no event shall Blindwall be liable for indirect, incidental, special, consequential, or punitive damages, loss of profits, loss of data, or business interruption.",
      ],
    },
    {
      heading: "Indemnity",
      body: [
        "You agree to indemnify and hold harmless Blindwall, its directors, employees, and agents from any claim, loss, or expense (including reasonable legal fees) arising out of (a) your breach of these Terms, (b) your unauthorized testing of any asset, or (c) your use of the audit report.",
      ],
    },
    {
      heading: "Term & Termination",
      body: [
        "These Terms commence when you purchase the Service and continue until the audit is delivered and any survival obligations expire. We may suspend or terminate the Service immediately if you breach these Terms or use the Service unlawfully.",
      ],
    },
    {
      heading: "Governing Law & Jurisdiction",
      body: [
        `These Terms are governed by the laws of India. The courts at ${JURISDICTION_CITY} shall have exclusive jurisdiction over any dispute arising under these Terms, subject to mandatory consumer protection rights you may have under the Consumer Protection Act, 2019.`,
      ],
    },
    {
      heading: "Changes to the Terms",
      body: [
        'We may update these Terms from time to time. The updated version will be posted on this page with a new "Last updated" date. Continued use of the Service after changes constitutes acceptance.',
      ],
    },
    {
      heading: "Contact",
      body: [
        `Questions about these Terms should be sent to ${SUPPORT_EMAIL} or by post to ${REGISTERED_ADDRESS}.`,
      ],
    },
  ],
};
