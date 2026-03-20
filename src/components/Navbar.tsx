import { motion } from "framer-motion";
import { Music, ShoppingCart, Menu, User, Shield, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
{ label: "Accueil", href: "/" },
{ label: "Catalogue", href: "/catalog" },
{ label: "Artistes", href: "#artists" },
{ label: "Contact", href: "#contact" }];


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  return (
    <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        





















































        

        {isOpen &&
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden mt-4 pb-4 space-y-4">
            {navLinks.map((link) =>
          <div key={link.label}>
                {link.href.startsWith("/") ?
            <Link to={link.href} onClick={() => setIsOpen(false)} className={`block py-2 transition-colors ${location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>{link.label}</Link> :

            <a href={link.href} className="block text-muted-foreground hover:text-primary transition-colors py-2">{link.label}</a>
            }
              </div>
          )}
            <div className="flex gap-4 pt-4">
              <Link to="/cart" className="flex-1">
                <Button variant="glass" className="w-full gap-2"><ShoppingCart className="w-4 h-4" />Panier ({totalItems})</Button>
              </Link>
              {user ?
            <Link to="/profile" className="flex-1">
                  <Button variant="glass" className="w-full gap-2"><User className="w-4 h-4" />Profil</Button>
                </Link> :

            <Link to="/auth" className="flex-1">
                  <Button variant="neon" className="w-full">Connexion</Button>
                </Link>
            }
            </div>
            {isAdmin &&
          <Link to="/admin"><Button variant="glass" className="w-full gap-2"><Shield className="w-4 h-4" />Admin</Button></Link>
          }
          </motion.div>
        }
      </div>
    </motion.nav>);

};