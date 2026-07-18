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
  cartShippingTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
        attributes: {},
        shippingCost: Number(item.products?.shipping_cost || 0)
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
    const savedCart = localStorage.getItem("homiq_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        // ignore
      }
    }
    setIsLoaded(true);
  }, []);

  // 5. Persist guest cart to local storage
  useEffect(() => {
    if (!user && isLoaded) {
      localStorage.setItem("homiq_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user, isLoaded]);

  const isUuid = (id: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

  const addToCart = async (product: Product, quantity = 1, attributes?: Record<string, string>) => {
    let resolvedProductId = product.id;
    let resolvedIsUuid = isUuid(product.id);

    if (user && !resolvedIsUuid) {
      const supabase = createClient();
      const { data: dbProd } = await supabase
        .from("products")
        .select("id")
        .eq("slug", product.slug)
        .single();
      if (dbProd) {
        resolvedProductId = dbProd.id;
        resolvedIsUuid = true;
      }
    }

    if (user && resolvedIsUuid) {
      const supabase = createClient();
      const existing = cartItems.find((i) => i.productId === resolvedProductId);
      const newQty = existing ? existing.quantity + quantity : quantity;

      const { error } = await supabase
        .from("cart_items")
        .upsert({
          user_id: user.id,
          product_id: resolvedProductId,
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
        const existingItemIndex = prev.findIndex((item) => item.productId === resolvedProductId);
        if (existingItemIndex > -1) {
          const updated = [...prev];
          updated[existingItemIndex].quantity += quantity;
          return updated;
        }
        const newItem: CartItem = {
          id: resolvedIsUuid ? `${resolvedProductId}-${Date.now()}` : resolvedProductId,
          productId: resolvedProductId,
          name: product.name,
          price: product.salePrice ?? product.price,
          image: product.images[0] || "",
          quantity,
          attributes,
          shippingCost: product.shippingCost || 0
        };
        toast.success(`Appended ${product.name} to cart.`);
        return [...prev, newItem];
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (user) {
      const supabase = createClient();
      let dbItemId = itemId;
      if (!isUuid(itemId)) {
        const matchingItem = cartItems.find((i) => i.id === itemId || i.productId === itemId);
        if (matchingItem && isUuid(matchingItem.productId)) {
          dbItemId = matchingItem.productId;
        }
      }

      if (isUuid(dbItemId)) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", dbItemId);

        if (error) {
          toast.error("Failed to remove item: " + error.message);
        } else {
          await fetchDbCart(user.id);
        }
      }
    }
    setCartItems((prev) => prev.filter((item) => item.id !== itemId && item.productId !== itemId));
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (user) {
      const supabase = createClient();
      let dbItemId = itemId;
      if (!isUuid(itemId)) {
        const matchingItem = cartItems.find((i) => i.id === itemId || i.productId === itemId);
        if (matchingItem && isUuid(matchingItem.productId)) {
          dbItemId = matchingItem.productId;
        }
      }

      if (isUuid(dbItemId)) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity })
          .eq("user_id", user.id)
          .eq("product_id", dbItemId);

        if (error) {
          toast.error("Failed to update quantity: " + error.message);
        } else {
          await fetchDbCart(user.id);
        }
      }
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId || item.productId === itemId ? { ...item, quantity } : item))
    );
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
  const cartShippingTotal = cartItems.reduce((acc, item) => acc + (item.shippingCost || 0) * item.quantity, 0);

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
        cartShippingTotal,
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
