import { motion } from "framer-motion";
import { Music, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const footerLinks = {
  Produits: ["Albums", "Singles", "Packs", "Abonnements"],
  Société: ["À propos", "Carrières", "Presse", "Contact"],
  Support: ["FAQ", "Aide", "Remboursements", "Conditions"]
};

const socialLinks = [
{ icon: Instagram, href: "#" },
{ icon: Twitter, href: "#" },
{ icon: Youtube, href: "#" },
{ icon: Mail, href: "#" }];


export const Footer = () => {
  return (
    <footer id="contact" className="relative pt-24 pb-12 border-t border-border/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 bg-secondary-foreground">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 bg-primary-foreground text-primary">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}>

              <div className="relative">
                <Music className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 blur-lg bg-destructive-foreground text-destructive-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-glow-cyan text-destructive-foreground">
                NLOUNQ
              </span>
            </motion.div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href }) =>
              <a
                key={href}
                href={href}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">

                  <Icon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) =>
          <div key={title}>
              <h4 className="font-display font-semibold mb-4 text-foreground">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) =>
              <li key={link}>
                    <a
                  href="#"
                  className="transition-colors duration-300 text-sm text-muted-foreground hover:text-primary">

                      {link}
                    </a>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 glass mb-12 rounded-xl">

          























        </motion.div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 NLOUNQ. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>);

};