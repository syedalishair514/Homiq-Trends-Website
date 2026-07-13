"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { hoverCard } from "@/constants/animations";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
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
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      whileHover="hover"
      variants={hoverCard}
      className="group h-full"
    >
      <Card className={`${DESIGN_SYSTEM.radius.card} overflow-hidden border border-border bg-card h-full flex flex-col justify-between transition-all group-hover:border-primary/20 relative shadow-sm`}>
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground font-sans text-[10px] uppercase tracking-wider font-semibold border-none rounded px-2 py-0.5">
              New
            </Badge>
          )}
          {product.salePrice && (
            <Badge className="bg-destructive text-destructive-foreground font-sans text-[10px] uppercase tracking-wider font-semibold border-none rounded px-2 py-0.5">
              Sale
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleLikeToggle}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/85 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors focus:outline-none cursor-pointer"
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-primary text-primary border-none" : "stroke-[1.5]"}`} />
        </button>

        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] bg-muted overflow-hidden shrink-0">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={product.isFeatured}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-light">
              No Image Available
            </div>
          )}

          {/* Quick Add Overlay on Hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-background/90 to-transparent flex justify-center z-10">
            <Button
              onClick={handleAddToCart}
              className={`${DESIGN_SYSTEM.radius.button} w-full bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 text-xs py-5 cursor-pointer`}
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </Button>
          </div>
        </Link>

        {/* Info */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between pt-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium font-sans">
              {product.category}
            </span>
            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="font-sans font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-sm font-semibold text-foreground font-sans">
                    ${product.salePrice}
                  </span>
                  <span className="text-xs line-through text-muted-foreground font-sans">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-foreground font-sans">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-xs font-medium text-foreground font-sans">{product.rating}</span>
              <span className="text-[10px] text-muted-foreground font-sans">({product.reviewsCount})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
