import React, { createContext, useContext, useState, useCallback } from "react";
import { Track } from "./AudioPlayerContext";

export interface CartItem extends Track {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (track: Track) => void;
  removeFromCart: (trackId: string) => void;
  updateQuantity: (trackId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (trackId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((track: Track) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === track.id);
      if (existing) {
        return prev.map((item) =>
          item.id === track.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...track, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((trackId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== trackId));
  }, []);

  const updateQuantity = useCallback((trackId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(trackId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === trackId ? { ...item, quantity } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback((trackId: string) => {
    return items.some((item) => item.id === trackId);
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
