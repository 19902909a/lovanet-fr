import { motion } from "framer-motion";
import { Music, ShoppingCart, Menu, User, Play } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Catalogue", href: "/catalog" },
  { label: "Espace Média", href: "/media" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <div className="relative">
                <Music className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 blur-lg bg-primary/30" />
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-glow-cyan">
                NEON WAVE
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.div key={link.label} whileHover={{ y: -2 }}>
                {link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    className={`transition-colors duration-300 font-medium tracking-wide ${
                      location.pathname === link.href
                        ? "text-primary text-glow-cyan"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="transition-colors duration-300 font-medium tracking-wide text-foreground hover:text-primary"
                  >
                    {link.label}
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full text-xs flex items-center justify-center font-bold text-secondary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="neon" size="default">
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
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 transition-colors ${
                      location.pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="block text-muted-foreground hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
            <div className="flex gap-4 pt-4">
              <Link to="/cart" className="flex-1">
                <Button variant="glass" className="w-full gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Panier ({totalItems})
                </Button>
              </Link>
              <Link to="/profile" className="flex-1">
                <Button variant="glass" className="w-full gap-2">
                  <User className="w-4 h-4" />
                  Profil
                </Button>
              </Link>
            </div>
            <Button variant="neon" className="w-full mt-4">
              Connexion
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};