import Hero from "@/app/(marketing)/sections/Hero";
import Problem from "@/app/(marketing)/sections/Problem";
import Solution from "@/app/(marketing)/sections/Solution";
import Features from "@/app/(marketing)/sections/Features";
import WhyItMatters from "@/app/(marketing)/sections/WhyItMatters";
import HowItWorks from "@/app/(marketing)/sections/HowItWorks";
import BuiltFor from "@/app/(marketing)/sections/BuiltFor";
import Pricing from "@/app/(marketing)/sections/Pricing";

import CTA from "@/app/(marketing)/sections/CTA";
import FAQ from "@/app/(marketing)/sections/FAQ";

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <WhyItMatters />
      <HowItWorks />
      <BuiltFor />
      <Pricing />
      <CTA />
      <FAQ />
    </main>
  );
}
