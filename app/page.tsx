"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/features/home/Hero/Hero";
import Categories from "@/features/home/Categories/Categories";
import ExploreByRoom from "@/features/home/ExploreByRoom/ExploreByRoom";
import FeaturedProducts from "@/features/home/FeaturedProducts/FeaturedProducts";
import WhyChooseUs from "@/features/home/WhyChooseUs/WhyChooseUs";
import NewArrival from "@/features/home/NewArrival/NewArrival";
import Testimonials from "@/features/home/Testimonials/Testimonials";
import Instagram from "@/features/home/Instagram/Instagram";
import Newsletter from "@/features/home/Newsletter/Newsletter";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
      {/* 
        The Navbar overlays the Hero component at top-0. 
        As the user scrolls, the scroll hook triggers a blur background shift.
      */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Carousel Banner Slider */}
        <Hero />

        {/* 2. Shop By Categories Pinterest Masonry */}
        <Categories />

        {/* 3. Explore By Room Cinematic snap track */}
        <ExploreByRoom />

        {/* 4. Featured Products 8-card grid */}
        <FeaturedProducts />

        {/* 5. Why Choose Homiq / Trust Section */}
        <WhyChooseUs />

        {/* 6. New Arrival Spotlight Promotion Banner */}
        <NewArrival />

        {/* 7. Testimonials quotes slider */}
        <Testimonials />

        {/* 8. Instagram Inspiration gallery */}
        <Instagram />

        {/* 9. Newsletter subscription box */}
        <Newsletter />

        {/* Developer Sandbox (Collapsible Preview at Bottom of Fold) */}
        <section className="py-12 border-t border-border/40 bg-secondary/5 dark:bg-[#121212]/5">
          <Container>
            <details className="group cursor-pointer">
              <summary className="font-heading text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-between select-none">
                <span>[Developer Controls] Click to open State/Design sandboxes</span>
                <span className="text-xs group-open:rotate-180 transition-transform">&darr;</span>
              </summary>
              <div className="mt-8 pt-8 border-t border-border/30 cursor-default" onClick={(e) => e.stopPropagation()}>
                <SectionHeading
                  title="Component Playground"
                  subtitle="Developer Preview"
                  description="Interact with the foundation components to verify accessibility, theme variables, and global state actions."
                />

                {/* Tab switcher */}
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
              </div>
            </details>
          </Container>
        </section>
      </main>

      {/* Loading Overlay */}
      {showFullSpinner && <LoadingSpinner fullPage />}

      <Footer />
    </div>
  );
}
