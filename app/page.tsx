import Navbar from "@/components/Navbar";
import Standards from "@/components/Standards";
import LocomotiveScrollProvider from "@/components/LocomotiveScrollProvider";
import Core from "@/components/Core";
import PreFooter from "@/components/PreFooter";
import Footer from "@/components/Footer";
import Blogs from "@/components/Blogs";
import Stacking from "@/components/Stacking";
import Hero from "@/components/Hero";
import TrustedBySection from "@/components/TrustedBySection";
import FeatureSection from "@/components/FeaturSection";

export default function Home() {
  return (
    <>
    <FeatureSection />
    <TrustedBySection />
    </>
    // <LocomotiveScrollProvider>
    //   <div className="relative min-h-screen w-full">
    //     <Navbar />
        
    //     {/* ✅ Each section must be wrapped in data-scroll-section */}
    //     <div data-scroll-section>
    //       <Hero />
    //     </div>

    //     <div data-scroll-section>
    //       <Standards />
    //     </div>

    //     {/* <div data-scroll-section>
    //       <Stacking />
    //     </div> */}

    //     <div data-scroll-section>
    //       <Core />
    //     </div>

    //     <div data-scroll-section>
    //       <Blogs />
    //     </div>

    //     <div data-scroll-section>
    //       <PreFooter />
    //     </div>

    //     <div data-scroll-section>
    //       <Footer />
    //     </div>
    //   </div>
    // </LocomotiveScrollProvider>

   
  );
}