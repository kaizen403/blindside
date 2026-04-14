import Hero from "@/app/sections/Hero";
import Problem from "@/app/sections/Problem";
import Solution from "@/app/sections/Solution";
import Features from "@/app/sections/Features";
import WhyItMatters from "@/app/sections/WhyItMatters";
import HowItWorks from "@/app/sections/HowItWorks";
import BuiltFor from "@/app/sections/BuiltFor";
import Pricing from "@/app/sections/Pricing";
import Report from "@/app/sections/Report";
import Trust from "@/app/sections/Trust";
import CTA from "@/app/sections/CTA";
import FAQ from "@/app/sections/FAQ";

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
      <Report />
      <Trust />
      <CTA />
      <FAQ />
    </main>
  );
}
