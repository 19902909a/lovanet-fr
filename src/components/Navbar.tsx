import { motion } from "framer-motion";
import { Music, ShoppingCart, Menu, Package } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const navLinks = [
  { label: "Accueil", href: "#" },
  { label: "Catalogue", href: "#catalog" },
  { label: "Suivi", href: "#tracking" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl gradient-ios flex items-center justify-center shadow-ios-md">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              MusicFlow
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Package className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-ios-red rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </Button>
            <Button variant="ios" size="default">
              Connexion
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-2"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button variant="ios" className="w-full mt-4">
              Connexion
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
