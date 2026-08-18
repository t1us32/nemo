import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import BeachClubSection from "@/components/sections/BeachClubSection";
import RestaurantSection from "@/components/sections/RestaurantSection";
import SpaSection from "@/components/sections/SpaSection";
import RoomsSection from "@/components/sections/RoomsSection";

export default function Home() {
  return (
    <>
      <Header />
      {/* Sections are fixed layers driven by the stage machine; this spacer is what
          the page scrolls through to the footer once the last rest is passed. */}
      <main>
        <div style={{ height: "100dvh" }} aria-hidden="true" />
        <HeroSection />
        <BeachClubSection />
        <RestaurantSection />
        <SpaSection />
        <RoomsSection />
      </main>
      <Footer />
    </>
  );
}
