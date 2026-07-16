"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/constants/categories";
import { slideUp, staggerContainer } from "@/constants/animations";
import { Sofa, Bed, Coffee, Bath, Laptop, Sparkles } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import Container from "@/components/shared/Container";

const iconMap = {
  "living-room": Sofa,
  "bedroom": Bed,
  "kitchen": Coffee,
  "bathroom": Bath,
  "office": Laptop,
  "decoration": Sparkles,
};

export default function Categories() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF8] dark:bg-[#181816]">
      <Container>
        <SectionHeading
          title="Shop By Categories"
          subtitle="Fine Collections"
          description="Curated furniture and decor groupings designed to bring harmony, luxury materials, and comfort to every corner of your home."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer(0.08)}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:auto-rows-[260px]"
        >
          {CATEGORIES.map((cat, index) => {
            const Icon = iconMap[cat.slug as keyof typeof iconMap] || Sparkles;
            
            // Pinterest grid spans:
            // First item (Living Room) spans 2 columns and 2 rows
            const isFeatured = index === 0;
            const gridClasses = isFeatured
              ? "md:col-span-2 md:row-span-2 h-[380px] md:h-full"
              : "md:col-span-1 md:row-span-1 h-[260px] md:h-full";

            return (
              <motion.div
                key={cat.id}
                variants={slideUp(0.4, 25)}
                className={`relative rounded-2xl overflow-hidden border border-border/80 group ${gridClasses} bg-white`}
              >
                {/* Background Image Wrapper */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ 
                    backgroundImage: `url(${cat.image})`,
                    backgroundColor: index % 2 === 0 ? "#E5E0D8" : "#EFECE6" 
                  }}
                />
                
                {/* Soft Warm overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/30 transition-all duration-300 z-10" />
                <div className="absolute inset-0 bg-[#EEDCCB]/10 mix-blend-overlay z-10 pointer-events-none" />

                {/* Content Panel */}
                <Link
                  href={`/categories/${cat.slug}`}
                  className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-end text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 mb-2.5 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-8.5 h-8.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-xs flex items-center justify-center text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-[#FAF9F6] font-medium font-sans">
                      {cat.productCount} products
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-normal tracking-wide text-[#FCFBF7]">
                    {cat.name}
                  </h3>

                  {isFeatured && cat.description && (
                    <p className="text-xs text-[#FCFBF7]/75 font-sans font-light mt-2 max-w-sm hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {cat.description}
                    </p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
