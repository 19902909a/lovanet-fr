import { motion } from "framer-motion";
import { Music, ShoppingCart, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
const navLinks = [{
  label: "Accueil",
  href: "#"
}, {
  label: "Catalogue",
  href: "#catalog"
}, {
  label: "Artistes",
  href: "#artists"
}, {
  label: "Contact",
  href: "#contact"
}];
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <motion.nav initial={{
    y: -100,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} transition={{
    duration: 0.8,
    ease: "easeOut"
  }} className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div className="flex items-center gap-3" whileHover={{
          scale: 1.05
        }}>
            <div className="relative">
              <Music className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 blur-lg bg-destructive-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-glow-cyan">N L O U N Q  H W A V E</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => <motion.a key={link.label} href={link.href} className="transition-colors duration-300 font-medium tracking-wide text-destructive-foreground" whileHover={{
            y: -2
          }}>
                {link.label}
              </motion.a>)}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full text-xs flex items-center justify-center font-bold">
                3
              </span>
            </Button>
            <Button variant="neon" size="default">
              Connexion
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: "auto"
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden mt-4 pb-4 space-y-4">
            {navLinks.map(link => <a key={link.label} href={link.href} className="block text-muted-foreground hover:text-primary transition-colors py-2">
                {link.label}
              </a>)}
            <Button variant="neon" className="w-full mt-4">
              Connexion
            </Button>
          </motion.div>}
      </div>
    </motion.nav>;
};