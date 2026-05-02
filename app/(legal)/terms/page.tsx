import type { Metadata } from "next";
import LegalPage from "@/app/(legal)/components/LegalPage";
import { termsContent } from "@/app/(legal)/terms/content";

export const metadata: Metadata = {
  title: "Terms of Service — Blindwall",
  description:
    "Terms of Service for Blindwall — practical security testing for startups and growing businesses.",
};

export default function TermsPage() {
  return <LegalPage {...termsContent} />;
}
