"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/constants/products";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { motion } from "framer-motion";
import { staggerContainer, slideUp } from "@/constants/animations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ChevronRight, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DESIGN_SYSTEM } from "@/constants/theme";
import Link from "next/link";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search keyword from query parameters
  const queryParam = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(queryParam);
  
  // Sidebar filters
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceLimit, setPriceLimit] = useState<number>(1000);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    }
    router.push(`/search?${params.toString()}`);
  };

  // Filtered list
  const searchResults = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesQuery =
        !queryParam ||
        product.name.toLowerCase().includes(queryParam.toLowerCase()) ||
        product.description.toLowerCase().includes(queryParam.toLowerCase()) ||
        product.category.toLowerCase().includes(queryParam.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      const activePrice = product.salePrice ?? product.price;
      const matchesPrice = activePrice <= priceLimit;

      return matchesQuery && matchesCategory && matchesPrice;
    });
  }, [queryParam, selectedCategory, priceLimit]);

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container>
          <div className="space-y-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/80">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-semibold">Search</span>
            </div>

            <SectionHeading
              title={queryParam ? `Results for "${queryParam}"` : "Search Our Collection"}
              subtitle="Curation Search"
              description="Locate custom travertine plates, organic cashmere blankets, or modern lamps instantly."
            />

            {/* Large Search Box */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-3">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-12 bg-white dark:bg-[#222220] border-border rounded-xl text-sm py-6 shadow-2xs w-full focus-visible:ring-primary focus-visible:border-primary"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="absolute right-4 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className={`${DESIGN_SYSTEM.radius.button} bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest px-6 py-6 cursor-pointer`}
              >
                Search
              </Button>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
              {/* Filter Column */}
              <aside className="lg:col-span-3 bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                <h3 className="font-heading text-base font-semibold text-foreground border-b border-border pb-3">Refine Results</h3>
                
                {/* Categories */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-primary">Category</h4>
                  <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-left text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-secondary text-primary font-bold"
                            : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price limit */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[10px] uppercase tracking-wider font-bold text-primary">Price Limit</h4>
                    <span className="text-xs font-bold text-accent">${priceLimit}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={10}
                    value={priceLimit}
                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                    className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </aside>

              {/* Grid Results */}
              <div className="lg:col-span-9 space-y-6">
                <div className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border/60 pb-3">
                  Found {searchResults.length} matches for your query
                </div>

                {searchResults.length === 0 ? (
                  <div className="bg-white dark:bg-[#222220] border border-border rounded-3xl p-16 text-center space-y-4">
                    <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto stroke-[1.25]" />
                    <h3 className="font-heading text-xl font-medium text-foreground">No matches found</h3>
                    <p className="text-xs text-muted-foreground font-sans max-w-sm mx-auto leading-relaxed">
                      We couldn&apos;t find any design catalog items matching your keyword or filter combination.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchInput("");
                        setSelectedCategory("All");
                        setPriceLimit(1000);
                        router.push("/search");
                      }}
                      className={`${DESIGN_SYSTEM.radius.button} bg-primary text-primary-foreground py-5 px-6 text-xs uppercase tracking-wider font-bold cursor-pointer mt-2`}
                    >
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer(0.03)}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {searchResults.map((product) => (
                      <motion.div key={product.id} variants={slideUp(0.3, 15)}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen pt-32 pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SearchPageContent />
    </React.Suspense>
  );
}
