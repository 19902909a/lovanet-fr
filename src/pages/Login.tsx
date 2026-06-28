import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";

type Mode = "signin" | "signup";

const Login = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Compte créé. Vérifiez votre email pour confirmer.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connexion réussie");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Erreur d'authentification");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error("Connexion Google indisponible");
        return;
      }
      if (result.redirected) return;
      navigate("/");
    } catch {
      toast.error("Connexion Google indisponible");
    }
  };

  return (
    <PageShell>
      <Helmet>
        <title>Connexion client — AnimemomentsAnimeofficiel · Lovanet</title>
        <meta
          name="description"
          content="Connectez-vous à votre espace client AnimemomentsAnimeofficiel pour suivre vos commandes, sauvegarder vos favoris anime et accéder aux drops exclusifs Lovanet."
        />
        <link rel="canonical" href="https://lovanet.fr/login" />
        <meta property="og:title" content="Connexion client — Lovanet" />
        <meta property="og:url" content="https://lovanet.fr/login" />
      </Helmet>

      <section className="container mx-auto px-4 py-16 max-w-md">
        <header className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Espace client</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold">
            <span className="gradient-text">
              {mode === "signin" ? "Connexion" : "Créer un compte"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            AnimemomentsAnimeofficiel · Lovanet
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-[0_20px_60px_-20px_hsl(var(--neon-magenta)/0.45)]">
          <Button
            type="button"
            variant="glass"
            className="w-full mb-4"
            onClick={onGoogle}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path fill="#EA4335" d="M12 11v2.8h7.9c-.3 1.8-2.2 5.2-7.9 5.2-4.8 0-8.7-4-8.7-8.9S7.2 1.2 12 1.2c2.7 0 4.5 1.1 5.6 2.1l3.8-3.7C18.9-2.8 15.7-4 12-4 4.6-4-1.5 2.1-1.5 9.5S4.6 23 12 23c6.9 0 11.5-4.9 11.5-11.7 0-.8-.1-1.4-.2-2H12z"/>
            </svg>
            Continuer avec Google
          </Button>

          <div className="flex items-center gap-3 my-4 text-xs text-muted-foreground">
            <span className="h-px bg-border flex-1" /> ou par email <span className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" autoComplete="name" />
              </div>
            )}
            <div>
              <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="password" className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Mot de passe</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === "signin" ? "current-password" : "new-password"} />
            </div>
            <Button type="submit" variant="neon" size="lg" className="w-full" disabled={loading}>
              {mode === "signin" ? (<><LogIn className="w-4 h-4" /> Se connecter</>) : (<><UserPlus className="w-4 h-4" /> Créer mon compte</>)}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "signin" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary hover:underline font-medium">
              {mode === "signin" ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          En continuant, vous acceptez les <Link to="/legals" className="underline hover:text-primary">mentions légales</Link>.
        </p>
      </section>
    </PageShell>
  );
};

export default Login;