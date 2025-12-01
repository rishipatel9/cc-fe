import Navbar from "@/components/Navbar";
import Standards from "@/components/Standards";
import ScrollProvider from "@/components/ScrollProvider";
import Core from "@/components/Core";
import PreFooter from "@/components/PreFooter";
import Footer from "@/components/Footer";
import Blogs from "@/components/Blogs";
import Hero from "@/components/Hero";
import TrustedBySection from "@/components/TrustedBySection";
import FeatureSection from "@/components/FeaturSection";
import ImpactSection from "@/components/Impact";
import HowItWorks from "@/components/HowItWorks";

// ✅ Or use dynamic import with ssr: false
// const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: false });

export default function Page() {
  return (
    <ScrollProvider>
      <div className="relative min-h-screen w-full">
        <Navbar />
        <Hero />
        <Standards />
        <HowItWorks /> 
        <TrustedBySection />
        <Core />
        <ImpactSection />
        <FeatureSection />
        <Blogs />
        <PreFooter />
        <Footer />
      </div>
    </ScrollProvider>
  );
}