import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChaineYoutube from "./pages/ChaineYoutube";
import LecteursVideo from "./pages/LecteursVideo";
import PrimeVideo from "./pages/PrimeVideo";
import Tiktok from "./pages/Tiktok";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Legals from "./pages/Legals";
import NotFound from "./pages/NotFound";
import AnimeCountdown from "./pages/AnimeCountdown";
import AnimeCatalog from "./pages/AnimeCatalog";
import Discover from "./pages/Discover";
import { ThemeBubble } from "./components/ThemeBubble";
import { CartProvider } from "./context/CartContext";
import { CartDrawer } from "./components/CartDrawer";
import GoogleTranslate from "./components/GoogleTranslate";
import YoutubeBrandSettings from "./components/YoutubeBrandSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <CartProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chaine-youtube" element={<ChaineYoutube />} />
          <Route path="/lecteurs-video" element={<LecteursVideo />} />
          <Route path="/prime-video" element={<PrimeVideo />} />
          <Route path="/tiktok" element={<Tiktok />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legals" element={<Legals />} />
          <Route path="/anime-countdown" element={<AnimeCountdown />} />
          <Route path="/anime-catalog" element={<AnimeCatalog />} />
          <Route path="/decouvrir" element={<Discover />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ThemeBubble />
        <CartDrawer />
        <GoogleTranslate />
        <YoutubeBrandSettings />
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
