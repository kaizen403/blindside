import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const anthropicSans = localFont({
  src: [
    {
      path: "./fonts/AnthropicSans-Roman.woff2",
      style: "normal",
    },
    {
      path: "./fonts/AnthropicSans-Italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-anthropic-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Blind Side - Protect Your Application from AI Threats",
  description:
    "AI is making cyberattacks faster, smarter, and more scalable. Blind Side helps you identify vulnerabilities in your website, app, or infrastructure before they can be exploited.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anthropicSans.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
