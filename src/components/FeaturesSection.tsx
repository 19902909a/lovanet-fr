import { motion } from "framer-motion";
import { Headphones, Download, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Headphones,
    title: "Audio HD",
    description: "Qualité studio 24-bit pour une expérience d'écoute immersive",
    color: "blue",
  },
  {
    icon: Download,
    title: "Téléchargement Instantané",
    description: "Accès immédiat à vos achats dans tous les formats populaires",
    color: "green",
  },
  {
    icon: Zap,
    title: "Mises à Jour Gratuites",
    description: "Recevez les nouvelles versions et remixes gratuitement",
    color: "orange",
  },
  {
    icon: Shield,
    title: "Licence Commerciale",
    description: "Utilisez la musique dans vos projets créatifs et commerciaux",
    color: "purple",
  },
];

const colorStyles = {
  blue: { bg: "bg-ios-blue/10", text: "text-ios-blue" },
  green: { bg: "bg-ios-green/10", text: "text-ios-green" },
  orange: { bg: "bg-ios-orange/10", text: "text-ios-orange" },
  purple: { bg: "bg-ios-purple/10", text: "text-ios-purple" },
};

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-ios-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-ios-purple/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ios-teal/10 text-ios-teal text-sm font-medium mb-6">
              ✨ Pourquoi nous choisir
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              L'excellence
              <br />
              <span className="text-gradient">sonore garantie</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Nous sélectionnons uniquement les productions les plus innovantes 
              et offrons une expérience d'achat premium.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-muted-foreground text-sm">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">4.9★</div>
                <div className="text-muted-foreground text-sm">Note</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">24/7</div>
                <div className="text-muted-foreground text-sm">Support</div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const colors = colorStyles[feature.color as keyof typeof colorStyles];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="p-6 rounded-3xl bg-card shadow-ios-md hover:shadow-ios-lg transition-all duration-300"
                >
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors.bg}`}
                  >
                    <feature.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
