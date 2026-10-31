
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const userId = session?.user?.id;

  const loadCart = useCallback(async () => {
    if (!userId) {
      setCart([]);
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);

    try {
      const response = await fetch("/api/cart");

      if (!response.ok) {
        throw new Error("Failed to load cart");
      }

      const items: CartItem[] = await response.json();
      setCart(items);
    } catch (error) {
      console.error("Could not load cart:", error);
      setCart([]);
    } finally {
      setIsLoaded(true);
    }
  }, [userId]);

  useEffect(() => {
    if (isPending) return;

    let cancelled = false;

    async function load() {
      setIsLoaded(false);

      if (!userId) {
        setCart([]);
        setIsLoaded(true);
        return;
      }

      try {
        const response = await fetch("/api/cart");

        if (!response.ok) {
          throw new Error("Failed to load cart");
        }

        const items: CartItem[] = await response.json();

        if (!cancelled) setCart(items);
      } catch (error) {
        console.error("Could not load cart:", error);
        if (!cancelled) setCart([]);
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [userId, isPending]);

  async function addToCart(product: Omit<CartItem, "quantity">) {
    if (!userId || !isLoaded) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, productId: product.id }),
    });

    if (!response.ok) {
      alert("Could not add item to cart.");
      return;
    }

    await loadCart();
  }

  async function removeFromCart(id: number) {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    });

    if (response.ok) await loadCart();
  }

  async function updateQuantity(id: number, quantity: number) {
    if (quantity < 1) return;

    const response = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, quantity }),
    });

    if (response.ok) await loadCart();
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
  