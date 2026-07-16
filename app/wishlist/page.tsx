"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import EmptyState from "@/components/shared/EmptyState";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Heart, Trash2, ShoppingBag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DESIGN_SYSTEM } from "@/constants/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { Product } from "@/types/product";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    toast.success(`${product.name} has been moved to your bag!`);
  };

  const handleShareWishlist = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist share link copied to clipboard!");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1">
                <SectionHeading
                  title="My Wishlist"
                  subtitle="Saved Designs"
                  description="Keep track of your favorite collections, signature lights, and luxury textiles."
                />
              </div>
              {wishlist.length > 0 && (
                <Button
                  onClick={handleShareWishlist}
                  variant="outline"
                  className={`${DESIGN_SYSTEM.radius.button} border-border bg-white dark:bg-[#222220] hover:bg-secondary text-xs uppercase tracking-wider font-bold py-5 px-6 flex items-center gap-2 cursor-pointer transition-all duration-200`}
                >
                  <Share2 className="w-4 h-4" /> Share Wishlist
                </Button>
              )}
            </div>

            {wishlist.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  title="Your wishlist is empty"
                  description="Explore our curation catalog to save items you love for future planning."
                  icon={Heart}
                  ctaText="Explore Products"
                  ctaLink="/products"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white dark:bg-[#222220] rounded-3xl border border-border overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/5] bg-[#F8F5F2] dark:bg-[#1C1C1A] overflow-hidden">
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      
                      <button
                        onClick={() => {
                          removeFromWishlist(product.id);
                          toast.info(`${product.name} removed from wishlist.`);
                        }}
                        className="absolute top-4 right-4 bg-white/90 dark:bg-[#222220]/90 backdrop-blur-xs p-2.5 rounded-full border border-border text-muted-foreground hover:text-destructive hover:scale-110 active:scale-90 transition-all duration-200 shadow-xs cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.5]" />
                      </button>

                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center">
                          <span className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground bg-white dark:bg-[#222220] px-3.5 py-1.5 rounded-full shadow-sm border border-border">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-accent font-semibold">
                          {product.category}
                        </span>
                        <h4 className="font-sans font-medium text-sm text-foreground group-hover:text-primary transition-colors mt-0.5 line-clamp-1">
                          <Link href={`/products/${product.slug}`}>{product.name}</Link>
                        </h4>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-sm font-bold text-foreground">
                            ${product.salePrice ?? product.price}
                          </span>
                          {product.salePrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${product.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        disabled={product.stock === 0}
                        onClick={() => handleMoveToCart(product)}
                        className={`${DESIGN_SYSTEM.radius.button} w-full py-5 bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-xs active:shadow-none transition-all duration-200 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
