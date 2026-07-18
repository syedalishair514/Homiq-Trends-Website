"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { DESIGN_SYSTEM } from "@/constants/theme";

interface QuickViewDialogProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewDialog({
  product,
  isOpen,
  onClose,
}: QuickViewDialogProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
    onClose();
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl rounded-2xl p-6 md:p-8 bg-white dark:bg-[#222220] border border-border outline-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Images Section */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[4/5] relative bg-[#F8F5F2] dark:bg-[#1C1C1A] rounded-xl overflow-hidden border border-border/60">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover animate-in fade-in duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                      selectedImage === img ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold block mb-1">
                  {product.category}
                </span>
                <h2 className="font-heading text-2xl font-normal tracking-wide text-foreground">
                  {product.name}
                </h2>
                <span className="text-xs text-muted-foreground font-mono mt-1 block">SKU: {product.sku}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-[#C69A63]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < Math.floor(product.rating)
                          ? "fill-[#C69A63] text-[#C69A63]"
                          : "text-[#C69A63]/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-foreground">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviewsCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {product.salePrice ? (
                  <>
                    <span className="text-2xl font-semibold text-[#1F1F1F] dark:text-[#F5F2EC] font-sans">
                      Rs. {product.salePrice}
                    </span>
                    <span className="text-base line-through text-muted-foreground font-sans">
                      Rs. {product.price}
                    </span>
                    <Badge className="bg-[#EEDCCB] text-accent border-none rounded px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold">
                      Save {product.discountPercentage}%
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl font-semibold text-[#1F1F1F] dark:text-[#F5F2EC] font-sans">
                    Rs. {product.price}
                  </span>
                )}
              </div>

              {/* Descriptions */}
              <p className="text-xs sm:text-sm text-muted-foreground font-sans font-light leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status Badge */}
              <div className="pt-2">
                {isOutOfStock ? (
                  <span className="text-xs text-destructive font-semibold uppercase tracking-wider">Out of Stock</span>
                ) : product.stock <= 3 ? (
                  <span className="text-xs text-amber-600 dark:text-amber-500 font-semibold uppercase tracking-wider">Only {product.stock} left in stock - Limited</span>
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-500 font-semibold uppercase tracking-wider">In Stock ({product.stock} units)</span>
                )}
              </div>
            </div>

            {/* Action Panel */}
            <div className="pt-6 border-t border-border mt-6 flex flex-col sm:flex-row gap-4 items-center">
              {!isOutOfStock && (
                <div className="flex items-center border border-border rounded-xl h-12 bg-[#F8F5F2] dark:bg-[#1C1C1A] shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 text-center text-lg hover:text-primary transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-10 text-center text-lg hover:text-primary transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              )}
              
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`${DESIGN_SYSTEM.radius.button} w-full h-12 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none`}
              >
                <ShoppingBag className="w-4 h-4" /> {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
