"use client";

import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, attributes?: Record<string, string>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  // 1. Fetch current database cart items
  const fetchDbCart = async (userId: string) => {
    const supabase = createClient();
    const { data: dbItems, error } = await supabase
      .from("cart_items")
      .select("*, products(*, product_images(*))")
      .eq("user_id", userId);
    
    if (!error && dbItems) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = dbItems.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.products?.name || "Product",
        price: Number(item.products?.sale_price ?? item.products?.price ?? 0),
        image: item.products?.product_images?.[0]?.image_url || "",
        quantity: item.quantity,
        attributes: {}
      }));
      setCartItems(mapped);
    }
  };

  // 2. Merge guest local storage items with database cart upon login
  const mergeGuestCart = async (userId: string) => {
    const supabase = createClient();
    const savedCart = localStorage.getItem("homiq_cart");
    if (!savedCart) {
      await fetchDbCart(userId);
      return;
    }

    let guestCart: CartItem[] = [];
    try {
      guestCart = JSON.parse(savedCart);
    } catch {
      await fetchDbCart(userId);
      return;
    }

    if (guestCart.length === 0) {
      await fetchDbCart(userId);
      return;
    }

    toast.info("Syncing guest cart items...");

    // Fetch database items first to merge quantities
    const { data: dbItems } = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("user_id", userId);

    const dbMap = new Map<string, number>();
    if (dbItems) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dbItems.forEach((i: any) => dbMap.set(i.product_id, i.quantity));
    }

    for (const item of guestCart) {
      const currentQty = dbMap.get(item.productId) || 0;
      const targetQty = currentQty + item.quantity;

      await supabase
        .from("cart_items")
        .upsert({
          user_id: userId,
          product_id: item.productId,
          quantity: targetQty
        }, { onConflict: "user_id,product_id" });
    }

    localStorage.removeItem("homiq_cart");
    await fetchDbCart(userId);
    toast.success("Guest cart merged!");
  };

  // 3. Listen to auth state updates
  useEffect(() => {
    const supabase = createClient();
    
    // Fetch initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      if (newUser) {
        await mergeGuestCart(newUser.id);
      } else {
        // Logged out, fetch guest cart
        const savedCart = localStorage.getItem("homiq_cart");
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            setTimeout(() => {
              setCartItems(parsed);
            }, 0);
          } catch {
            setTimeout(() => {
              setCartItems([]);
            }, 0);
          }
        } else {
          setTimeout(() => {
            setCartItems([]);
          }, 0);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4. Initial load on mount for guests
  useEffect(() => {
    if (!user) {
      const savedCart = localStorage.getItem("homiq_cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setTimeout(() => {
            setCartItems(parsed);
          }, 0);
        } catch {
          // ignore
        }
      }
    }
  }, [user]);

  const isFirstRender = useRef(true);

  // 5. Persist guest cart to local storage
  useEffect(() => {
    if (!user) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      localStorage.setItem("homiq_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const isUuid = (id: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

  const addToCart = async (product: Product, quantity = 1, attributes?: Record<string, string>) => {
    if (user && isUuid(product.id)) {
      const supabase = createClient();
      const existing = cartItems.find((i) => i.productId === product.id);
      const newQty = existing ? existing.quantity + quantity : quantity;

      const { error } = await supabase
        .from("cart_items")
        .upsert({
          user_id: user.id,
          product_id: product.id,
          quantity: newQty
        }, { onConflict: "user_id,product_id" });

      if (error) {
        toast.error("Failed to add to database cart: " + error.message);
      } else {
        toast.success(`Appended ${product.name} to cart.`);
        await fetchDbCart(user.id);
      }
    } else {
      setCartItems((prev) => {
        const existingItemIndex = prev.findIndex((item) => item.productId === product.id);
        if (existingItemIndex > -1) {
          const updated = [...prev];
          updated[existingItemIndex].quantity += quantity;
          return updated;
        }
        const newItem: CartItem = {
          id: isUuid(product.id) ? `${product.id}-${Date.now()}` : product.id,
          productId: product.id,
          name: product.name,
          price: product.salePrice ?? product.price,
          image: product.images[0] || "",
          quantity,
          attributes,
        };
        toast.success(`Appended ${product.name} to cart.`);
        return [...prev, newItem];
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (user && isUuid(itemId)) {
      const supabase = createClient();
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);

      if (error) {
        toast.error("Failed to remove item: " + error.message);
      } else {
        await fetchDbCart(user.id);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (user && isUuid(itemId)) {
      const supabase = createClient();
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", itemId);

      if (error) {
        toast.error("Failed to update quantity: " + error.message);
      } else {
        await fetchDbCart(user.id);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      const supabase = createClient();
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to clear database cart: " + error.message);
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProviderWrapper");
  }
  return context;
};
