"use client";

import React, { useState, useEffect } from "react";
import { PRODUCTS } from "@/constants/products";
import SectionHeading from "@/components/shared/SectionHeading";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/shared/ProductCard";
import { motion } from "framer-motion";
import { staggerContainer } from "@/constants/animations";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(*)")
          .limit(4);

        if (!error && data && data.length > 0) {
          const mapped: Product[] = data.map((p: any) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            slug: p.slug,
            shortDescription: p.short_description,
            description: p.description,
            price: Number(p.price),
            salePrice: p.sale_price ? Number(p.sale_price) : undefined,
            images: p.product_images?.sort((a: any, b: any) => a.priority - b.priority).map((img: any) => img.image_url) || [],
            category: p.category || "Decoration",
            rating: p.rating ? Number(p.rating) : 5,
            reviewsCount: p.reviews_count || 0,
            stock: p.stock,
            isFeatured: p.rating >= 4.7,
            bestSeller: p.reviews_count > 30,
            newArrival: false,
            createdAt: p.created_at
          }));
          setProducts(mapped);
        } else {
          setProducts(PRODUCTS.slice(0, 4));
        }
      } catch {
        setProducts(PRODUCTS.slice(0, 4));
      }
    }
    loadFeaturedProducts();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF8] dark:bg-[#181816] border-t border-border/40">
      <Container>
        <SectionHeading
          title="Featured Collections"
          subtitle="Top Picks"
          description="Explore our best-selling signature pieces crafted to bring warmth, luxury, and premium functionality to your personal spaces."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer(0.08)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
