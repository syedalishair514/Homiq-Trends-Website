"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye, RefreshCw } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { hoverCard } from "@/constants/animations";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import QuickViewDialog from "./QuickViewDialog";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLimited = product.stock > 0 && product.stock <= 3;

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist.`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to comparison list.`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover="hover"
        variants={hoverCard}
        className="group h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className={`${DESIGN_SYSTEM.radius.card} overflow-hidden border border-border bg-white dark:bg-[#222220] h-full flex flex-col justify-between transition-all group-hover:border-primary/30 relative shadow-xs hover:shadow-md duration-350`}>
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
            {isOutOfStock ? (
              <Badge className="bg-black/10 dark:bg-white/10 text-foreground/60 border-none text-[9px] uppercase tracking-wider font-semibold rounded px-2.5 py-1">
                Sold Out
              </Badge>
            ) : isLimited ? (
              <Badge className="bg-destructive/10 text-destructive border-none text-[9px] uppercase tracking-wider font-semibold rounded px-2.5 py-1 animate-pulse">
                Limited
              </Badge>
            ) : null}

            {!isOutOfStock && product.newArrival && (
              <Badge className="bg-[#EEDCCB] text-accent border-none text-[9px] uppercase tracking-wider font-semibold rounded px-2.5 py-1">
                New
              </Badge>
            )}
            
            {!isOutOfStock && product.salePrice && (
              <Badge className="bg-destructive/10 text-destructive border-none text-[9px] uppercase tracking-wider font-semibold rounded px-2.5 py-1">
                Sale
              </Badge>
            )}

            {!isOutOfStock && product.bestSeller && (
              <Badge className="bg-[#EEDCCB] text-accent border-none text-[9px] uppercase tracking-wider font-semibold rounded px-2.5 py-1">
                Best Seller
              </Badge>
            )}
          </div>

          {/* Quick-action Wishlist Button */}
          <button
            onClick={handleLikeToggle}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full border border-border flex items-center justify-center transition-all focus:outline-none cursor-pointer ${
              isLiked 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-white/90 dark:bg-[#222220]/90 backdrop-blur-xs text-muted-foreground hover:text-primary hover:bg-white"
            }`}
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-primary-foreground text-primary-foreground" : "stroke-[1.5]"}`} />
          </button>

          {/* Image Container with Hover Crossfade */}
          <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] bg-[#F8F5F2] dark:bg-[#1C1C1A] overflow-hidden shrink-0">
            {product.images[0] ? (
              <div className="w-full h-full relative">
                {/* Primary Image */}
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={product.isFeatured}
                  className={`object-cover transition-all duration-700 ${
                    product.images[1] && isHovered ? "opacity-0 scale-102" : "opacity-100 scale-100"
                  }`}
                />
                
                {/* Secondary Hover Image */}
                {product.images[1] && (
                  <Image
                    src={product.images[1]}
                    alt={`${product.name} alternate view`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`object-cover absolute inset-0 transition-all duration-700 ${
                      isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                    }`}
                  />
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-light">
                No Image Available
              </div>
            )}

            {/* Zara-style Hover Controls */}
            <div className="absolute inset-0 bg-[#EEDCCB]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
              <Button
                onClick={handleQuickView}
                size="icon"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#222220] border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-xs translate-y-4 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4 stroke-[1.5]" />
              </Button>
              
              <Button
                onClick={handleCompare}
                size="icon"
                className="w-10 h-10 rounded-full bg-white dark:bg-[#222220] border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-xs translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 cursor-pointer"
                aria-label="Compare Product"
              >
                <RefreshCw className="w-4 h-4 stroke-[1.5]" />
              </Button>
              
              {!isOutOfStock && (
                <Button
                  onClick={handleAddToCart}
                  size="icon"
                  className="w-10 h-10 rounded-full bg-white dark:bg-[#222220] border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-xs translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 cursor-pointer"
                  aria-label="Add to cart"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                </Button>
              )}
            </div>
          </Link>

          {/* Product Details Info */}
          <CardContent className="p-4 flex-1 flex flex-col justify-between pt-5 bg-white dark:bg-[#222220]">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold font-sans">
                {product.category}
              </span>
              <Link href={`/products/${product.slug}`} className="block">
                <h3 className="font-sans font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-between">
              {/* Price Details */}
              <div className="flex items-baseline gap-2">
                {product.salePrice ? (
                  <>
                    <span className="text-sm font-semibold text-[#1F1F1F] dark:text-[#F5F2EC] font-sans">
                      Rs. {product.salePrice}
                    </span>
                    <span className="text-xs line-through text-muted-foreground font-sans">
                      Rs. {product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-[#1F1F1F] dark:text-[#F5F2EC] font-sans">
                    Rs. {product.price}
                  </span>
                )}
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C69A63] text-[#C69A63]" />
                <span className="text-xs font-semibold text-foreground font-sans">{product.rating}</span>
                <span className="text-[9px] text-muted-foreground font-sans">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Mobile-only Add to Bag Action Button */}
            <div className="mt-3.5 sm:hidden w-full">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/95 text-[10px] font-bold uppercase tracking-wider py-3 rounded-xl cursor-pointer"
              >
                {isOutOfStock ? "Sold Out" : "Add to Bag"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick View Dialog Modal */}
      <QuickViewDialog
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
