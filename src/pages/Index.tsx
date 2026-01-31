import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CatalogSection } from "@/components/CatalogSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { WidgetsSection } from "@/components/WidgetsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden pb-24 relative z-10">
      <Navbar />
      <HeroSection />
      <CatalogSection />
      <FeaturesSection />
      <WidgetsSection />
      <Footer />
    </div>
  );
};

export default Index;
