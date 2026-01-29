import { motion } from "framer-motion";
import { Music, Instagram, Twitter, Youtube, Mail } from "lucide-react";
const footerLinks = {
  Produits: ["Albums", "Singles", "Packs", "Abonnements"],
  Société: ["À propos", "Carrières", "Presse", "Contact"],
  Support: ["FAQ", "Aide", "Remboursements", "Conditions"]
};
const socialLinks = [{
  icon: Instagram,
  href: "#"
}, {
  icon: Twitter,
  href: "#"
}, {
  icon: Youtube,
  href: "#"
}, {
  icon: Mail,
  href: "#"
}];
export const Footer = () => {
  return <footer id="contact" className="relative pt-24 pb-12 border-t border-border/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <motion.div className="flex items-center gap-3 mb-6" whileHover={{
            scale: 1.05
          }}>
              <div className="relative">
                <Music className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 blur-lg bg-primary/50" />
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-glow-cyan">
                SYNTHWAVE
              </span>
            </motion.div>
            <p className="text-muted-foreground text-sm mb-6">
              La destination ultime pour la musique électronique et synthwave de qualité premium.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => <motion.a key={index} href={social.href} whileHover={{
              y: -3,
              scale: 1.1
            }} className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300">
                  <social.icon className="w-5 h-5" />
                </motion.a>)}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => <div key={title}>
              <h4 className="font-display font-semibold mb-4 text-foreground">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm">
                      {link}
                    </a>
                  </li>)}
              </ul>
            </div>)}
        </div>

        {/* Newsletter */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="p-8 rounded-2xl glass mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold mb-2">
                Rejoignez la <span className="gradient-text">Révolution</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                Recevez les dernières sorties et offres exclusives
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input type="email" placeholder="votre@email.com" className="flex-1 md:w-64 px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body" />
              <motion.button whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-display font-medium tracking-wider hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300">
                S'inscrire
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026  N L O U Q. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-primary transition-colors">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>;
};