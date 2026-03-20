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
            {features.map((feature, index) => {}


























          )}
          </div>
        </div>
      </div>
    </section>;
};