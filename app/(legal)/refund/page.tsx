import type { Metadata } from "next";
import LegalPage from "@/app/(legal)/components/LegalPage";
import { refundContent } from "@/app/(legal)/refund/content";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy — Blindwall",
  description:
    "Refund and cancellation policy for Blindwall security audit services.",
  alternates: {
    canonical: "https://blindwall.tech/refund",
  },
};

export default function RefundPage() {
  return <LegalPage {...refundContent} />;
}
