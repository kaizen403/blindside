import type { LegalPageProps } from "@/app/(legal)/components/LegalPage";

// Legal copy delivered by Sara. DPDP Act 2023 compliant.
// Some entity-specific values are marked "to be confirmed" pending Rishi's
// final company registration / payment-gateway / grievance-officer details.
const ENTITY_NAME = "Blindwall (operating entity — to be confirmed)";
const REGISTERED_ADDRESS = "Registered office address — to be confirmed";
const GST_NUMBER = "GSTIN — to be confirmed";
const SUPPORT_EMAIL = "rishi@blindwall.tech";
const PAYMENT_GATEWAY = "our payment gateway provider (to be confirmed)";
const GRIEVANCE_OFFICER_NAME = "Grievance Officer — to be confirmed";
const GRIEVANCE_OFFICER_EMAIL = "rishi@blindwall.tech";

export const privacyContent: LegalPageProps = {
  title: "Privacy Policy",
  lastUpdated: "May 2, 2026",
  intro:
    `${ENTITY_NAME} ("Blindwall", "we", "us", "our") operates the website blindwall.tech and provides one-time security audit services. We are committed to protecting your personal data in accordance with the Digital Personal Data Protection Act, 2023 ("DPDP Act") and other applicable Indian laws. This Privacy Policy explains what personal data we collect, how we use it, the lawful basis for processing, and the rights available to you as a Data Principal.`,
  sections: [
    {
      heading: "Data Fiduciary",
      body: [
        "The Data Fiduciary responsible for your personal data is:",
        `${ENTITY_NAME}. Registered office: ${REGISTERED_ADDRESS}. GSTIN: ${GST_NUMBER}. Contact: ${SUPPORT_EMAIL}.`,
      ],
    },
    {
      heading: "Personal Data We Collect",
      body: [
        "We collect the following categories of personal data:",
        "Identity & contact data: name, email address, phone number, billing address.",
        "Transaction data: payment confirmation, GSTIN (if you provide one), invoice records. Card and bank details are processed by our payment gateway and are not stored by us.",
        "Audit scope data: URLs, IP addresses, credentials, and any technical information you provide to enable the audit. This may include personal data of your end users if exposed by the audited asset.",
        "Communications data: emails, chat, and support messages you send us.",
        "Website usage data: IP address, browser type, device identifiers, pages viewed, and timestamps, collected via cookies and server logs.",
      ],
    },
    {
      heading: "Purposes & Lawful Basis for Processing",
      body: [
        "We process personal data for the following purposes, on the lawful basis of your consent or for the performance of the contract under the DPDP Act:",
        "Delivering the security audit and report — lawful basis: contract.",
        "Processing payment and issuing tax invoices — lawful basis: contract and legal obligation.",
        "Customer support and communication — lawful basis: contract and consent.",
        "Security, fraud prevention, audit logs — lawful basis: legitimate use under Section 7 of the DPDP Act.",
        "Marketing communications (where opted in) — lawful basis: consent.",
        "Compliance with legal obligations — lawful basis: legal obligation.",
      ],
    },
    {
      heading: "Cookies",
      body: [
        "We use strictly necessary cookies to operate the website and, with your consent, analytics cookies to understand usage. You can manage cookie preferences through your browser settings.",
      ],
    },
    {
      heading: "Sharing of Personal Data",
      body: [
        "We share personal data only with:",
        `Payment processors (e.g., ${PAYMENT_GATEWAY}) to process transactions.`,
        "Cloud and infrastructure providers that host our website and store audit reports under contractual confidentiality and security obligations.",
        "Professional advisors (lawyers, auditors, accountants) where necessary.",
        "Government authorities where required by law, court order, or to protect our legal rights.",
        "We do not sell your personal data.",
      ],
    },
    {
      heading: "Data Retention",
      body: [
        "We retain personal data only for as long as necessary for the purposes set out above:",
        "Audit reports and scope data: 24 months from delivery, unless you request earlier deletion.",
        "Invoice and tax records: 8 years as required under Indian tax law.",
        "Marketing consent records: until withdrawn.",
        "Server and security logs: 12 months.",
      ],
    },
    {
      heading: "Data Security",
      body: [
        "We implement reasonable security safeguards including encryption in transit (TLS), encryption at rest for audit reports, access controls, logging, and periodic review. No method of transmission or storage is fully secure; we will notify you and the Data Protection Board of India of any personal data breach as required under the DPDP Act.",
      ],
    },
    {
      heading: "Cross-Border Transfers",
      body: [
        "Where personal data is transferred outside India to our cloud or service providers, such transfers will be made only to jurisdictions permitted under the DPDP Act and subject to appropriate safeguards.",
      ],
    },
    {
      heading: "Your Rights as a Data Principal",
      body: [
        "Under the DPDP Act, you have the right to:",
        "Access a summary of your personal data and the processing activities.",
        "Correction, completion, updating, and erasure of your personal data.",
        "Withdraw consent at any time, with prospective effect.",
        "Grievance redressal through our Grievance Officer (see section below).",
        "Nominate another individual to exercise your rights in the event of your death or incapacity.",
        `To exercise any of these rights, write to ${SUPPORT_EMAIL}. We will respond within the timelines prescribed by the DPDP Act.`,
      ],
    },
    {
      heading: "Children",
      body: [
        "Our Service is not directed at individuals under the age of 18. We do not knowingly process the personal data of children. If you believe we have inadvertently done so, please contact us and we will delete the data.",
      ],
    },
    {
      heading: "Grievance Officer",
      body: [
        "In accordance with the Information Technology Act, 2000 and the DPDP Act, the contact details of our Grievance Officer are:",
        `Name: ${GRIEVANCE_OFFICER_NAME}. Email: ${GRIEVANCE_OFFICER_EMAIL}. Address: ${REGISTERED_ADDRESS}.`,
        "We will acknowledge grievances within 48 hours and resolve them within 30 days.",
      ],
    },
    {
      heading: "Changes to this Policy",
      body: [
        'We may update this Privacy Policy from time to time. The updated version will be posted on this page with a new "Last updated" date. Material changes will be notified to you by email or a prominent notice on the website.',
      ],
    },
    {
      heading: "Contact",
      body: [
        `For any questions about this Privacy Policy or our data practices, contact ${SUPPORT_EMAIL} or write to us at ${REGISTERED_ADDRESS}.`,
      ],
    },
  ],
};
