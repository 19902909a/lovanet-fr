import { motion } from "framer-motion";
import { Headphones, Download, Zap, Shield } from "lucide-react";
const features = [{
  icon: Headphones,
  title: "Audio HD",
  description: "Qualité studio 24-bit pour une expérience d'écoute immersive",
  color: "primary"
}, {
  icon: Download,
  title: "Téléchargement Instantané",
  description: "Accès immédiat à vos achats dans tous les formats populaires",
  color: "secondary"
}, {
  icon: Zap,
  title: "Mises à Jour Gratuites",
  description: "Recevez les nouvelles versions et remixes gratuitement",
  color: "accent"
}, {
  icon: Shield,
  title: "Licence Commerciale",
  description: "Utilisez la musique dans vos projets créatifs et commerciaux",
  color: "primary"
}];
export const FeaturesSection = () => {
  return <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }}>
            


            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              L'Excellence
              <br />
              
            </h2>
            <p className="text-muted-foreground text-lg mb-8">Nous sélectionnons uniquement les productions les plus innovantes et offrons une expérience d'achat premium pour les passionnés de musique.</p>

            {/* Stats row */}
            <div className="flex gap-12">
              <div>
                
                
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-secondary text-glow-magenta">5★</div>
                
              </div>
              <div>
                
                
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => <motion.div key={feature.title} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} whileHover={{
            y: -5,
            scale: 1.02
          }} className="group p-6 rounded-2xl glass hover:border-primary/50 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300
                    ${feature.color === 'primary' ? 'bg-primary/20 text-primary group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]' : ''}
                    ${feature.color === 'secondary' ? 'bg-secondary/20 text-secondary group-hover:shadow-[0_0_30px_hsl(var(--secondary)/0.5)]' : ''}
                    ${feature.color === 'accent' ? 'bg-accent/20 text-accent group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.5)]' : ''}
                  `}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 transition-colors text-destructive-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </div>
    </section>;
};