"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingCart, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, slideUp, staggerContainer } from "@/constants/animations";
import { toast } from "sonner";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Aurelia Brass Pendant Light",
    slug: "aurelia-brass-pendant-light",
    description: "Elegant spun brass dome light featuring brushed metallic exterior and reflective interior glaze.",
    price: 245,
    images: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop"],
    category: "Lighting",
    rating: 4.8,
    reviewsCount: 24,
    stock: 12,
    isFeatured: true,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Sienna Travertine Catch-all Tray",
    slug: "sienna-travertine-tray",
    description: "Premium Honed Roman Travertine stone block with smooth curved depressions for modern item organization.",
    price: 89,
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop"],
    category: "Decor",
    rating: 4.7,
    reviewsCount: 15,
    stock: 8,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Cashmere Ribbed Lounge Throw",
    slug: "cashmere-ribbed-lounge-throw",
    description: "Ultra-fine Mongolian ribbed cashmere weave providing luxurious lightweight insulation for bedroom or sofas.",
    price: 180,
    salePrice: 145,
    images: ["https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=600&auto=format&fit=crop"],
    category: "Lifestyle",
    rating: 4.9,
    reviewsCount: 42,
    stock: 5,
    isFeatured: true,
    isNew: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Noir Sandalwood Soy Wax Candle",
    slug: "noir-sandalwood-soy-candle",
    description: "Hand-poured coconut soy candle infused with notes of sandalwood, warm amber, cardamom, and leather.",
    price: 45,
    images: ["https://images.unsplash.com/photo-1602872030219-cbf948018744?q=80&w=600&auto=format&fit=crop"],
    category: "Fragrance",
    rating: 4.6,
    reviewsCount: 51,
    stock: 20,
    isFeatured: true,
    isNew: true,
    createdAt: new Date().toISOString(),
  },
];

export default function Home() {
  const [showFullSpinner, setShowFullSpinner] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"states" | "spinner" | "design">("states");

  const triggerSpinner = () => {
    setShowFullSpinner(true);
    setTimeout(() => {
      setShowFullSpinner(false);
      toast.success("Content reloaded successfully!");
    }, 2000);
  };

  const handleRetry = () => {
    setErrorCount((prev) => prev + 1);
    toast.success(`Error state refreshed! Retry attempts: ${errorCount + 1}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center bg-[#0C0C0C] text-white overflow-hidden pt-16">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(191,161,95,0.12),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0C0C0C]/50 to-[#0C0C0C] pointer-events-none" />

        <Container className="relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.2, 0.1)}
            className="flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6"
          >
            <motion.span
              variants={fadeIn(0.6)}
              className="text-primary font-sans text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-primary" /> Redefining Luxury Lifestyles
            </motion.span>

            <motion.h1
              variants={slideUp(0.8, 30)}
              className="font-heading text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-[#FCFBF7] leading-none"
            >
              Timeless Aesthetics.<br />
              <span className="font-semibold text-primary">Curated Quality.</span>
            </motion.h1>

            <motion.p
              variants={slideUp(1.0, 20)}
              className="font-sans text-sm sm:text-base md:text-lg text-muted-foreground font-light max-w-2xl leading-relaxed"
            >
              Explore our boutique selection of hand-crafted lighting, organic stoneware catch-alls, and warm Mongolian cashmere essentials. Designed for modern luxury.
            </motion.p>

            <motion.div variants={slideUp(1.2, 10)} className="pt-4 flex gap-4">
              <Button className="rounded-xl px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-semibold tracking-wider uppercase cursor-pointer">
                Explore Collection
              </Button>
              <Button variant="outline" className="rounded-xl px-8 py-6 border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-sm font-semibold tracking-wider uppercase cursor-pointer">
                Our Story
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Showcase Grid */}
      <section className="py-20 sm:py-28 bg-background">
        <Container>
          <SectionHeading
            title="Featured Curations"
            subtitle="The Collection"
            description="Explore our best-selling signature pieces crafted to bring warmth, luxury, and premium functionality to your personal spaces."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      {/* Component Sandbox (Interactivity Check) */}
      <section className="py-16 sm:py-24 border-t border-border/60 bg-muted/10">
        <Container>
          <SectionHeading
            title="Component Playground"
            subtitle="Developer Preview"
            description="Interact with the foundation components to verify accessibility, theme variables, and global state actions."
          />

          {/* Styled Custom Tab Bar with layoutId animation */}
          <div className="flex bg-secondary border border-border p-1 mb-8 max-w-md mx-auto rounded-xl relative">
            {(["states", "spinner", "design"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 text-center text-xs py-2.5 rounded-lg font-medium relative z-10 transition-colors uppercase tracking-wider cursor-pointer"
                style={{ color: activeTab === tab ? "var(--primary-foreground)" : "var(--foreground)" }}
              >
                {tab === "states" && "Empty & Error"}
                {tab === "spinner" && "Loading"}
                {tab === "design" && "Design Tokens"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeSandboxTab"
                    className="absolute inset-0 bg-primary rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto min-h-[300px]">
            {activeTab === "states" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                <div className="border border-border p-6 rounded-2xl bg-card">
                  <span className="text-[10px] uppercase font-semibold text-primary tracking-widest block mb-4">
                    Empty State Component
                  </span>
                  <EmptyState
                    title="No Items Saved"
                    description="Your wishlist is currently empty. Explore our products and press the heart icon to save items here."
                    icon={ShoppingCart}
                    ctaText="Browse Decor"
                    ctaLink="/products"
                  />
                </div>
                <div className="border border-border p-6 rounded-2xl bg-card">
                  <span className="text-[10px] uppercase font-semibold text-primary tracking-widest block mb-4">
                    Error State Component
                  </span>
                  <ErrorState
                    title="Failed to Load Reviews"
                    message="An error occurred while establishing database connection with the service endpoint. Please retry."
                    onRetry={handleRetry}
                  />
                </div>
              </div>
            )}

            {activeTab === "spinner" && (
              <div className="flex flex-col items-center justify-center p-12 border border-border bg-card rounded-2xl min-h-[300px] text-center gap-6 animate-in fade-in duration-300">
                <span className="text-xs uppercase font-semibold text-primary tracking-widest block">
                  Standard Spinner sizes
                </span>
                <div className="flex gap-8 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-[10px] text-muted-foreground">sm</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner size="md" />
                    <span className="text-[10px] text-muted-foreground">md</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner size="lg" />
                    <span className="text-[10px] text-muted-foreground">lg</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground max-w-sm mt-2 font-sans font-light">
                  You can also trigger a full-screen loading spinner overlay using the button below. It will automatically hide after 2 seconds.
                </p>
                <Button onClick={triggerSpinner} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 flex items-center gap-2 cursor-pointer px-6">
                  <RefreshCw className="w-4 h-4" /> Trigger Full Page Loader
                </Button>
              </div>
            )}

            {activeTab === "design" && (
              <div className="p-8 border border-border bg-card rounded-2xl space-y-6 animate-in fade-in duration-300">
                <h4 className="font-heading text-lg text-foreground mb-4">Branding Tokens</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-border flex flex-col gap-2">
                    <div className="w-full h-12 bg-primary rounded-lg border border-primary/20" />
                    <span className="text-xs font-semibold">Primary (Gold)</span>
                    <span className="text-[10px] text-muted-foreground">#BFA15F</span>
                  </div>
                  <div className="p-4 rounded-xl border border-border flex flex-col gap-2">
                    <div className="w-full h-12 bg-secondary rounded-lg border border-border" />
                    <span className="text-xs font-semibold">Secondary (Cashmere)</span>
                    <span className="text-[10px] text-muted-foreground">#EFECE6</span>
                  </div>
                  <div className="p-4 rounded-xl border border-border flex flex-col gap-2">
                    <div className="w-full h-12 bg-background rounded-lg border border-border" />
                    <span className="text-xs font-semibold">Background (Cream)</span>
                    <span className="text-[10px] text-muted-foreground">#FCFBF7</span>
                  </div>
                  <div className="p-4 rounded-xl border border-border flex flex-col gap-2">
                    <div className="w-full h-12 bg-[#0C0C0C] rounded-lg border border-white/10" />
                    <span className="text-xs font-semibold">Matte Black</span>
                    <span className="text-[10px] text-muted-foreground">#0C0C0C</span>
                  </div>
                </div>
                <div className="border-t border-border pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xs uppercase tracking-wider font-semibold mb-2">Typography Mapping</h5>
                    <ul className="text-xs space-y-1.5 text-muted-foreground font-sans font-light">
                      <li><strong className="text-foreground font-medium">Serif / Headings:</strong> Playfair Display</li>
                      <li><strong className="text-foreground font-medium">Sans-Serif / UI:</strong> Inter</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs uppercase tracking-wider font-semibold mb-2">Border Radius Mapping</h5>
                    <ul className="text-xs space-y-1.5 text-muted-foreground font-sans font-light">
                      <li><strong className="text-foreground font-medium">Buttons / Inputs:</strong> 12px (rounded-xl)</li>
                      <li><strong className="text-foreground font-medium">Cards / Dialogs:</strong> 16px (rounded-2xl)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Loading Overlay */}
      {showFullSpinner && <LoadingSpinner fullPage />}

      <Footer />
    </div>
  );
}
