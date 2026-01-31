import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Lock, Tag, Truck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { GamesWidget } from "@/components/widgets/GamesWidget";
import { useState } from "react";

const Cart = () => {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const finalPrice = totalPrice - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "neon10") {
      setPromoApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden relative z-10">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Panier</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-4">Votre panier est vide</h2>
              <p className="text-muted-foreground mb-8">
                Découvrez notre catalogue et ajoutez vos albums favoris
              </p>
              <Link to="/catalog">
                <Button variant="neon" size="lg">
                  Explorer le catalogue
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">Articles</h2>
                  <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Vider le panier
                  </Button>
                </div>

                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass rounded-xl p-4 flex gap-4"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.artist}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center glass rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl font-bold text-primary">
                        {(item.price * item.quantity).toFixed(2)}€
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.price.toFixed(2)}€ / unité
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Promo Code */}
                <div className="glass rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Code promo (ex: NEON10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="pl-10"
                        disabled={promoApplied}
                      />
                    </div>
                    <Button
                      variant="glass"
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !promoCode}
                    >
                      {promoApplied ? "Appliqué ✓" : "Appliquer"}
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-accent mt-2">
                      Code NEON10 appliqué : -10% de réduction!
                    </p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-6">
                <div className="glass rounded-xl p-6 sticky top-24">
                  <h3 className="font-display text-lg font-semibold mb-4">Résumé</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{totalPrice.toFixed(2)}€</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-sm text-accent">
                        <span>Réduction (-10%)</span>
                        <span>-{discount.toFixed(2)}€</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-accent">Gratuite</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-display font-semibold">Total</span>
                      <span className="font-display text-2xl font-bold text-primary text-glow-blue">
                        {finalPrice.toFixed(2)}€
                      </span>
                    </div>
                  </div>

                  <Button variant="neon" size="lg" className="w-full gap-2 mb-4">
                    <CreditCard className="w-5 h-5" />
                    Passer la commande
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Paiement 100% sécurisé
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Téléchargement instantané
                    </div>
                  </div>

                  {/* Payment methods */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Moyens de paiement</p>
                    <div className="flex gap-2">
                      {["💳", "🍎", "💰", "₿"].map((icon, i) => (
                        <div
                          key={i}
                          className="w-10 h-6 rounded bg-card flex items-center justify-center text-sm"
                        >
                          {icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mini Widgets */}
                <WeatherWidget />
                <GamesWidget />
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
