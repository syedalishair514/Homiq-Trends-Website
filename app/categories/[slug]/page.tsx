"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/constants/categories";
import { PRODUCTS } from "@/constants/products";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, slideUp } from "@/constants/animations";
import { createClient } from "@/lib/supabase/client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function CategoryPageContent({ params }: CategoryPageProps) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productsList, setProductsList] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: catData } = await supabase.from("categories").select("*");
        const { data: prodData } = await supabase.from("products").select("*, product_images(*)");

        if (catData && catData.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setCategoriesList(catData.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            image: c.image_url
          })));
        }
        if (prodData && prodData.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setProductsList(prodData.map((p: any) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            slug: p.slug,
            shortDescription: p.short_description,
            description: p.description,
            price: Number(p.price),
            salePrice: p.sale_price ? Number(p.sale_price) : undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            images: p.product_images?.sort((a: any, b: any) => a.priority - b.priority).map((img: any) => img.image_url) || [],
            category: p.category || "Decoration",
            rating: p.rating ? Number(p.rating) : 5,
            reviewsCount: p.reviews_count || 0,
            stock: p.stock
          })));
        }
      } catch {
        // fallbacks
      }
    }
    loadData();
  }, []);

  const activeCategories = categoriesList.length > 0 ? categoriesList : CATEGORIES;
  const activeProducts = productsList.length > 0 ? productsList : PRODUCTS;

  const category = useMemo(() => {
    return activeCategories.find((c) => c.slug === slug);
  }, [slug, activeCategories]);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return activeProducts.filter((p) => p.category.toLowerCase() === category.name.toLowerCase());
  }, [category, activeProducts]);

  if (!category) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center text-center">
          <Container>
            <div className="space-y-4">
              <h2 className="font-heading text-3xl font-semibold text-foreground">Collection Not Found</h2>
              <p className="text-sm text-muted-foreground">The requested design collection could not be located.</p>
              <Link href="/categories" className="text-xs uppercase tracking-widest font-semibold text-primary block hover:underline">
                &larr; Back to Collections
              </Link>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] space-y-12">
        {/* Category Editorial Hero Banner */}
        <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden bg-secondary">
          <Image
            src={category.image || ""}
            alt={category.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-center">
            <Container className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#EEDCCB] font-bold">Homiq Trends Collection</span>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">{category.name}</h1>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto font-light leading-relaxed">
                {category.description}
              </p>
            </Container>
          </div>
        </div>

        <Container>
          <div className="space-y-8">
            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/80">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/categories" className="hover:text-primary transition-colors">Collections</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-semibold">{category.name}</span>
            </div>

            {/* Catalog Split Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Found {categoryProducts.length} premium products in this collection
                </span>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors flex items-center gap-1.5"
                >
                  Advanced Filtering <SlidersHorizontal className="w-3.5 h-3.5" />
                </Link>
              </div>

              {categoryProducts.length === 0 ? (
                <div className="bg-white dark:bg-[#222220] border border-border rounded-3xl p-16 text-center space-y-4">
                  <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto stroke-[1.25]" />
                  <h3 className="font-heading text-xl font-medium text-foreground">No items available</h3>
                  <p className="text-xs text-muted-foreground font-sans max-w-sm mx-auto leading-relaxed">
                    We currently don&apos;t have stock lists loaded for the {category.name} collection. Check back soon for artisan releases.
                  </p>
                  <Link href="/products">
                    <Button className="bg-primary text-primary-foreground py-5 px-6 text-xs uppercase tracking-wider font-bold cursor-pointer mt-2">
                      Shop Full Catalog
                    </Button>
                  </Link>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer(0.04)}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                  {categoryProducts.map((product) => (
                    <motion.div key={product.id} variants={slideUp(0.3, 15)}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="text-center pt-8">
              <Link href="/categories" className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1">
                &larr; View All Collections
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen pt-32 pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <CategoryPageContent params={params} />
    </React.Suspense>
  );
}
