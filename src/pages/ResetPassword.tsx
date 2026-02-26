import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Mot de passe mis à jour" });
      navigate("/profile");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-[100px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md mx-4">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <Music className="w-10 h-10 text-primary" />
          <span className="font-display text-3xl font-bold tracking-wider text-glow-cyan">NLOUNQ</span>
        </Link>
        <div className="glass rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold text-center mb-6">Nouveau mot de passe</h1>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} placeholder="••••••••" />
              </div>
            </div>
            <Button variant="neon" className="w-full" type="submit" disabled={loading}>
              {loading ? "..." : "Mettre à jour"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
