import type { Metadata } from "next";
import LegalPage from "@/app/(legal)/components/LegalPage";
import { privacyContent } from "@/app/(legal)/privacy/content";

export const metadata: Metadata = {
  title: "Privacy Policy — Blindwall",
  description:
    "Privacy Policy for Blindwall — how we collect, use, and protect your information.",
  alternates: {
    canonical: "https://blindwall.tech/privacy",
  },
};

export default function PrivacyPage() {
  return <LegalPage {...privacyContent} />;
}
