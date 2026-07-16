"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { HERO_SLIDES } from "@/constants/hero";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DESIGN_SYSTEM } from "@/constants/theme";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [slidesList, setSlidesList] = useState<any[]>([]);

  useEffect(() => {
    async function loadBanners() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("hero_banners")
          .select("*")
          .eq("status", "active")
          .order("priority", { ascending: true });

        if (!error && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped = data.map((b: any) => ({
            id: b.id,
            title: b.heading,
            ctaText: b.cta_text || "Discover Catalog",
            link: b.cta_link || "/products",
            image: b.image_url
          }));
          setSlidesList(mapped);
        } else {
          setSlidesList(HERO_SLIDES);
        }
      } catch {
        setSlidesList(HERO_SLIDES);
      }
    }
    loadBanners();
  }, []);

  const activeSlides = slidesList.length > 0 ? slidesList : HERO_SLIDES;
  const slidesCount = activeSlides.length;

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slidesCount);
  }, [slidesCount]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slidesCount) % slidesCount);
  }, [slidesCount]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused) {
      timerRef.current = setInterval(handleNext, 6000);
    }
  }, [handleNext, isPaused]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        resetTimer();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        resetTimer();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, resetTimer]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      resetTimer();
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      resetTimer();
      handlePrev();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 30 : -30,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        opacity: { duration: 0.35, ease: "easeOut" as const },
        x: { type: "spring" as const, stiffness: 350, damping: 35 },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir < 0 ? 30 : -30,
      transition: {
        opacity: { duration: 0.35, ease: "easeIn" as const },
        x: { type: "spring" as const, stiffness: 350, damping: 35 },
      },
    }),
  };

  const currentSlide = activeSlides[currentIndex];

  return (
    <section 
      className="relative w-full min-h-[500px] md:h-[70vh] lg:h-[80vh] bg-secondary/15 dark:bg-[#121212]/15 pt-[calc(var(--navbar-height)+2.5rem)] sm:pt-[calc(var(--navbar-height)+4.5rem)] pb-12 sm:pb-20 flex items-center overflow-hidden border-b border-border/40 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center w-full"
          >
            {/* Left Column: Text Stack */}
            <div className="md:col-span-6 flex flex-col items-start gap-4 sm:gap-6 relative z-10 w-full max-w-xl">
              {currentSlide.subtitle && (
                <span className="text-accent text-xs font-semibold uppercase tracking-[0.25em] bg-[#EEDCCB]/65 px-3 py-1.5 rounded-md font-sans">
                  {currentSlide.subtitle}
                </span>
              )}

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-wide leading-tight">
                {currentSlide.title}
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground font-sans font-light leading-relaxed">
                {currentSlide.description}
              </p>

              <div className="flex gap-4 pt-2 w-full sm:w-auto">
                {currentSlide.buttonText && currentSlide.buttonLink && (
                  <Button render={<Link href={currentSlide.buttonLink} />} className={`${DESIGN_SYSTEM.radius.button} px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold tracking-widest uppercase cursor-pointer shadow-xs`}>
                    {currentSlide.buttonText}
                  </Button>
                )}
                <Button variant="outline" render={<Link href="/categories" />} className="rounded-xl px-8 py-6 border-primary text-accent hover:bg-[#EEDCCB]/30 text-xs font-bold tracking-widest uppercase cursor-pointer">
                  Explore Categories
                </Button>
              </div>
            </div>

            {/* Right Column: Lifestyle Image Container */}
            <div className="md:col-span-6 w-full flex justify-center items-center relative">
              {/* Decorative background cream glow */}
              <div className="absolute w-[80%] h-[80%] bg-primary/10 rounded-full blur-[70px] -z-10 pointer-events-none" />

              {/* Floating Image Wrapper */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-md bg-muted"
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
                  style={{
                    backgroundImage: `url(${currentSlide.mediaUrl})`,
                    backgroundColor: "#DFC1A5"
                  }}
                />
                
                {/* Soft Cream Overlay */}
                <div className="absolute inset-0 bg-[#EEDCCB]/25 mix-blend-overlay pointer-events-none" />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chevrons Navigation */}
      <button
        onClick={() => {
          resetTimer();
          handlePrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-border bg-white/85 text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all cursor-pointer focus:outline-none hidden xl:flex shadow-xs"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
      </button>
      <button
        onClick={() => {
          resetTimer();
          handleNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-border bg-white/85 text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all cursor-pointer focus:outline-none hidden xl:flex shadow-xs"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4 stroke-[1.5]" />
      </button>

      {/* Pagination Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {Array.from({ length: slidesCount }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              resetTimer();
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer focus:outline-none ${
              currentIndex === idx ? "bg-primary w-5" : "bg-border hover:bg-muted-foreground/35"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
