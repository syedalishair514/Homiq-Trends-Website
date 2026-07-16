"use client";

import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  // 1. Fetch wishlist from database
  const fetchDbWishlist = async (userId: string) => {
    const supabase = createClient();
    const { data: dbItems, error } = await supabase
      .from("wishlist_items")
      .select("*, products(*, product_images(*))")
      .eq("user_id", userId);

    if (!error && dbItems) {
      const mapped: Product[] = dbItems
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item.products !== null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ({
          id: item.products.id,
          sku: item.products.sku,
          name: item.products.name,
          slug: item.products.slug,
          shortDescription: item.products.short_description,
          description: item.products.description,
          price: Number(item.products.price),
          salePrice: item.products.sale_price ? Number(item.products.sale_price) : undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          images: item.products.product_images?.sort((a: any, b: any) => a.priority - b.priority).map((img: any) => img.image_url) || [],
          category: item.products.category || "Decoration",
          rating: item.products.rating ? Number(item.products.rating) : 5,
          reviewsCount: item.products.reviews_count || 0,
          stock: item.products.stock,
          isFeatured: item.products.rating >= 4.7,
          bestSeller: item.products.reviews_count > 30,
          newArrival: false,
          createdAt: item.products.created_at
        }));
      setWishlist(mapped);
    }
  };

  // 2. Merge guest local storage wishlist with database upon login
  const mergeGuestWishlist = async (userId: string) => {
    const supabase = createClient();
    const savedWishlist = localStorage.getItem("homiq_wishlist");
    if (!savedWishlist) {
      await fetchDbWishlist(userId);
      return;
    }

    let guestWishlist: Product[] = [];
    try {
      guestWishlist = JSON.parse(savedWishlist);
    } catch {
      await fetchDbWishlist(userId);
      return;
    }

    if (guestWishlist.length === 0) {
      await fetchDbWishlist(userId);
      return;
    }

    for (const prod of guestWishlist) {
      await supabase
        .from("wishlist_items")
        .upsert({
          user_id: userId,
          product_id: prod.id
        }, { onConflict: "user_id,product_id" });
    }

    localStorage.removeItem("homiq_wishlist");
    await fetchDbWishlist(userId);
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
        await mergeGuestWishlist(newUser.id);
      } else {
        // Logged out, fetch guest wishlist
        const savedWishlist = localStorage.getItem("homiq_wishlist");
        if (savedWishlist) {
          try {
            const parsed = JSON.parse(savedWishlist);
            setTimeout(() => {
              setWishlist(parsed);
            }, 0);
          } catch {
            setTimeout(() => {
              setWishlist([]);
            }, 0);
          }
        } else {
          setTimeout(() => {
            setWishlist([]);
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
      const savedWishlist = localStorage.getItem("homiq_wishlist");
      if (savedWishlist) {
        try {
          const parsed = JSON.parse(savedWishlist);
          setTimeout(() => {
            setWishlist(parsed);
          }, 0);
        } catch {
          // ignore
        }
      }
    }
  }, [user]);

  const isFirstRender = useRef(true);

  // 5. Persist guest wishlist to local storage
  useEffect(() => {
    if (!user) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      localStorage.setItem("homiq_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = async (product: Product) => {
    if (user) {
      const supabase = createClient();
      const { error } = await supabase
        .from("wishlist_items")
        .upsert({
          user_id: user.id,
          product_id: product.id
        }, { onConflict: "user_id,product_id" });

      if (error) {
        toast.error("Failed to add to database wishlist: " + error.message);
      } else {
        toast.success(`Appended ${product.name} to wishlist.`);
        await fetchDbWishlist(user.id);
      }
    } else {
      setWishlist((prev) => {
        if (prev.some((item) => item.id === product.id)) return prev;
        toast.success(`Appended ${product.name} to wishlist.`);
        return [...prev, product];
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      const supabase = createClient();
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) {
        toast.error("Failed to remove from database wishlist: " + error.message);
      } else {
        toast.success("Removed from wishlist.");
        await fetchDbWishlist(user.id);
      }
    } else {
      setWishlist((prev) => {
        const updated = prev.filter((item) => item.id !== productId);
        toast.success("Removed from wishlist.");
        return updated;
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = async () => {
    if (user) {
      const supabase = createClient();
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to clear wishlist: " + error.message);
      } else {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProviderWrapper");
  }
  return context;
};
