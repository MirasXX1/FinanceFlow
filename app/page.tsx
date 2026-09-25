import { Cta } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { StatsPreview } from "@/components/landing/stats-preview";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <StatsPreview />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
