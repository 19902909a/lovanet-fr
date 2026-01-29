import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, Clock, MapPin, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface TrackingStep {
  id: number;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  icon: React.ElementType;
}

const mockTrackingSteps: TrackingStep[] = [
  {
    id: 1,
    title: "Commande confirmée",
    description: "Votre paiement a été validé",
    time: "14:30",
    completed: true,
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: "En préparation",
    description: "Vos fichiers sont prêts",
    time: "14:32",
    completed: true,
    icon: Package,
  },
  {
    id: 3,
    title: "Transfert en cours",
    description: "Téléchargement disponible",
    time: "14:35",
    completed: true,
    icon: Truck,
  },
  {
    id: 4,
    title: "Livré",
    description: "Vérifiez votre bibliothèque",
    time: "En attente",
    completed: false,
    icon: MapPin,
  },
];

export const TrackingSection = () => {
  const [trackingId, setTrackingId] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = () => {
    if (trackingId.trim()) {
      setIsTracking(true);
    }
  };

  return (
    <section id="tracking" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ios-orange/10 text-ios-orange text-sm font-medium mb-4">
            <Package className="w-4 h-4" />
            Suivi personnalisé
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Suivez vos <span className="text-gradient">commandes</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Entrez votre numéro de commande pour suivre votre achat en temps réel
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto mb-12"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Ex: MF-2025-78542"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-ios-sm text-foreground"
              />
            </div>
            <Button variant="ios" size="xl" onClick={handleTrack}>
              Suivre
            </Button>
          </div>
        </motion.div>

        {/* Tracking Result */}
        {isTracking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Order Info Card */}
            <div className="bg-card rounded-3xl shadow-ios-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Commande</p>
                  <p className="text-lg font-bold">{trackingId || "MF-2025-78542"}</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-ios-green/10 text-ios-green text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-ios-green rounded-full animate-pulse-soft" />
                  En cours
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative mb-8">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full gradient-ios rounded-full"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">75% complété</p>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {mockTrackingSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="relative flex gap-4"
                  >
                    {/* Line */}
                    {index < mockTrackingSteps.length - 1 && (
                      <div 
                        className={`absolute left-5 top-12 w-0.5 h-full -translate-x-1/2 ${
                          step.completed ? 'bg-ios-green' : 'bg-border'
                        }`}
                      />
                    )}

                    {/* Icon */}
                    <div 
                      className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        step.completed 
                          ? 'bg-ios-green text-white shadow-ios-sm' 
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.title}
                        </h4>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-2xl bg-card shadow-ios-sm flex items-center gap-3 hover:shadow-ios-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-ios-blue/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-ios-blue" />
                </div>
                <span className="font-medium">Détails commande</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-2xl bg-card shadow-ios-sm flex items-center gap-3 hover:shadow-ios-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-ios-purple/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-ios-purple" />
                </div>
                <span className="font-medium">Notifications</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Demo hint */}
        {!isTracking && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground"
          >
            💡 Essayez avec n'importe quel numéro pour voir le suivi
          </motion.p>
        )}
      </div>
    </section>
  );
};
