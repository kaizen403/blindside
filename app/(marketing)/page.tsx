import Hero from "@/app/(marketing)/sections/Hero";
import HowItWorks from "@/app/(marketing)/sections/HowItWorks";
import Problem from "@/app/(marketing)/sections/Problem";
import Solution from "@/app/(marketing)/sections/Solution";
import Features from "@/app/(marketing)/sections/Features";
import WhyItMatters from "@/app/(marketing)/sections/WhyItMatters";
import BuiltFor from "@/app/(marketing)/sections/BuiltFor";
import Pricing from "@/app/(marketing)/sections/Pricing";

import CTA from "@/app/(marketing)/sections/CTA";
import FAQ from "@/app/(marketing)/sections/FAQ";
import Footer from "@/app/(marketing)/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Problem />
      <Solution />
      <Features />
      <WhyItMatters />
      <BuiltFor />
      <Pricing />
      <CTA />
      <FAQ />
      <Footer />
    </main>
  );
}
