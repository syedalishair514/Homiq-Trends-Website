"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { TESTIMONIALS } from "@/constants/testimonials";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/shared/SectionHeading";
import Container from "@/components/shared/Container";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const count = TESTIMONIALS.length;

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(handleNext, 6000);
  }, [handleNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

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
      x: dir > 0 ? "30%" : "-30%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 350, damping: 35 },
        opacity: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "30%" : "-30%",
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 350, damping: 35 },
        opacity: { duration: 0.35 },
      },
    }),
  };

  const item = TESTIMONIALS[currentIndex];

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF8] dark:bg-[#181816] border-t border-border/60 overflow-hidden">
      <Container>
        <SectionHeading
          title="Customer Testimonials"
          subtitle="Kind Words"
          description="Read experiences from our global community of architects, interior designers, and luxury lifestyle curators."
        />

        <div className="relative w-full max-w-4xl mx-auto min-h-[340px] flex flex-col items-center justify-center bg-white dark:bg-[#222220] border border-border p-8 sm:p-12 md:p-16 rounded-2xl shadow-xs select-none">
          {/* Decorative quote icon */}
          <div className="absolute top-6 left-6 text-primary/10">
            <Quote className="w-16 h-16 fill-current stroke-none" />
          </div>

          <div className="w-full relative overflow-hidden flex flex-col items-center text-center">
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
                className="w-full flex flex-col items-center gap-6 cursor-grab active:cursor-grabbing"
              >
                {/* Rating stars */}
                <div className="flex items-center text-[#C69A63] gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4.5 h-4.5 ${
                        idx < Math.floor(item.rating)
                          ? "fill-[#C69A63] text-[#C69A63]"
                          : "text-[#C69A63]/25"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="font-heading text-lg sm:text-xl md:text-2xl font-light text-foreground leading-relaxed max-w-2xl px-4">
                  &ldquo;{item.review}&rdquo;
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-border relative bg-secondary shrink-0 shadow-xs">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${item.avatar})`,
                        backgroundColor: "#E5E0D8",
                      }}
                    />
                  </div>
                  <div className="text-left">
                    <cite className="not-italic text-sm font-semibold text-foreground font-sans block">
                      {item.name}
                    </cite>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-light">
                      {item.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 justify-between items-center z-10 pointer-events-none hidden sm:flex">
            <button
              onClick={() => {
                resetTimer();
                handlePrev();
              }}
              className="w-10 h-10 rounded-full border border-border bg-white dark:bg-[#222220] hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all cursor-pointer pointer-events-auto focus:outline-none shadow-xs"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              onClick={() => {
                resetTimer();
                handleNext();
              }}
              className="w-10 h-10 rounded-full border border-border bg-white dark:bg-[#222220] hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-all cursor-pointer pointer-events-auto focus:outline-none shadow-xs"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, idx) => (
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
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
