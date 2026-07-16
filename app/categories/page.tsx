"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { motion } from "framer-motion";
import { slideUp, staggerContainer } from "@/constants/animations";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/lib/supabase/client";

export default function CategoriesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("categories").select("*");
        if (!error && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            image: c.image_url,
            productCount: 20
          }));
          setCategoriesList(mapped);
        } else {
          setCategoriesList(CATEGORIES);
        }
      } catch {
        setCategoriesList(CATEGORIES);
      }
    }
    loadCategories();
  }, []);

  const activeCategories = categoriesList.length > 0 ? categoriesList : CATEGORIES;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container>
          <div className="space-y-12">
            <SectionHeading
              title="Shop by Room & Categories"
              subtitle="Curation Directory"
              description="Browse signature collections designed to bring warmth, functionality, and organic harmony to every corner of your home."
            />

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.06)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {activeCategories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  variants={slideUp(0.4, 20)}
                  className="bg-white dark:bg-[#222220] border border-border rounded-2xl overflow-hidden group shadow-xs hover:shadow-md transition-all duration-350"
                >
                  <div className="aspect-[4/3] relative bg-[#F8F5F2] dark:bg-[#1C1C1A] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${cat.image})`,
                        backgroundColor: idx % 2 === 0 ? "#E5E0D8" : "#EFECE6",
                      }}
                    />
                    <div className="absolute inset-0 bg-[#EEDCCB]/10 mix-blend-overlay pointer-events-none" />
                  </div>
                  
                  <div className="p-6 space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                      {cat.productCount} Items
                    </span>
                    <h3 className="font-heading text-xl font-normal text-foreground">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans font-light leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className="text-xs text-primary group-hover:text-primary/80 transition-colors font-semibold uppercase tracking-wider flex items-center gap-1"
                      >
                        Browse Curation &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
