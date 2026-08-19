import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StageSpacer from "@/components/layout/StageSpacer";
import HeroSection from "@/components/sections/HeroSection";
import ResortSection from "@/components/sections/ResortSection";
import BeachClubSection from "@/components/sections/BeachClubSection";
import RestaurantSection from "@/components/sections/RestaurantSection";
import SpaSection from "@/components/sections/SpaSection";
import RoomsSection from "@/components/sections/RoomsSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <StageSpacer />
        <HeroSection />
        <ResortSection />
        <BeachClubSection />
        <RestaurantSection />
        <SpaSection />
        <RoomsSection />
      </main>
      <Footer />
    </>
  );
}
