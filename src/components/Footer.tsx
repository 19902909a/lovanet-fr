import { motion } from "framer-motion";
import { Music, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const footerLinks = {
  Produits: ["Albums", "Singles", "Packs", "Abonnements"],
  Société: ["À propos", "Carrières", "Presse", "Contact"],
  Support: ["FAQ", "Aide", "Remboursements", "Conditions"],
};

const socialLinks = [
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Youtube, href: "#" },
  { icon: Mail, href: "#" },
];

export const Footer = () => {
  return (
    <footer id="contact" className="relative pt-24 pb-12 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <motion.div 
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl gradient-ios flex items-center justify-center shadow-ios-sm">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                MusicFlow
              </span>
            </motion.div>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              La destination ultime pour la musique électronique de qualité premium.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-card shadow-ios-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4 text-foreground">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-card shadow-ios-md mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Restez <span className="text-gradient">informé</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                Recevez les dernières sorties et offres exclusives
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 md:w-64 h-12 px-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-12 px-6 rounded-xl gradient-ios text-white font-semibold shadow-ios-sm hover:shadow-ios-md transition-all"
              >
                S'inscrire
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 MusicFlow. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-primary transition-colors">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
