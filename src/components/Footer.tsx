import { Link } from "react-router-dom";
import { Play, Youtube, Music2, ShoppingBag, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/40 mt-24">
      <div className="container mx-auto px-4 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-primary/60 flex items-center justify-center bg-primary/10">
              <Play className="w-4 h-4 text-primary fill-primary" />
            </div>
            <span className="font-display font-extrabold tracking-wider">ANIMEMOMENTS</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Lovanet présente les meilleurs moments anime, shorts YouTube, TikTok et drops manga exclusifs.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-3 tracking-wider">PLATEFORMES</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/chaine-youtube" className="hover:text-primary flex items-center gap-2"><Youtube className="w-4 h-4" /> Chaîne YouTube</Link></li>
            <li><Link to="/tiktok" className="hover:text-primary flex items-center gap-2"><Music2 className="w-4 h-4" /> TikTok</Link></li>
            <li><Link to="/prime-video" className="hover:text-primary flex items-center gap-2"><Play className="w-4 h-4" /> Prime Vidéo</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-3 tracking-wider">BOUTIQUE</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Shop Anime</Link></li>
            <li><Link to="/lecteurs-video" className="hover:text-primary">Lecteurs vidéo</Link></li>
            <li><Link to="/nlounq" className="hover:text-primary">NLOUNQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-3 tracking-wider">CONTACT</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-primary flex items-center gap-2"><Mail className="w-4 h-4" /> Nous écrire</Link></li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4">Mention&nbsp;: <span className="text-foreground font-semibold tracking-wider">NLOUNQ</span></p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} Lovanet · AnimeMoments</span>
          <span>Site officiel · NLOUNQ</span>
        </div>
      </div>
    </footer>
  );
};