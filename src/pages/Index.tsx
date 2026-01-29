import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CatalogSection } from "@/components/CatalogSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <CatalogSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
