"use client";

import React from "react";
import { PRODUCTS } from "@/constants/products";
import SectionHeading from "@/components/shared/SectionHeading";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/shared/ProductCard";
import { motion } from "framer-motion";
import { staggerContainer } from "@/constants/animations";

export default function FeaturedProducts() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF8] dark:bg-[#181816] border-t border-border/40">
      <Container>
        <SectionHeading
          title="Featured Curations"
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
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
