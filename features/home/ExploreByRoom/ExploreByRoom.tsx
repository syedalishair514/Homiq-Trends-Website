"use client";

import React, { useRef, useState, useEffect } from "react";
import { ROOMS } from "@/constants/rooms";
import { motion } from "framer-motion";
import { slideUp } from "@/constants/animations";
import SectionHeading from "@/components/shared/SectionHeading";
import Container from "@/components/shared/Container";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ExploreByRoom() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF8] dark:bg-[#181816] overflow-hidden border-t border-border/40">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <SectionHeading
            title="Explore By Room"
            subtitle="Selected Spaces"
            align="left"
            description="Browse design collections tailored specifically for each room, making it easy to create cohesive luxury environments."
            className="mb-0 sm:mb-0 max-w-2xl mx-0"
          />
          
          {/* Scroll Buttons */}
          <div className="flex gap-3 mt-6 sm:mt-0">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground disabled:hover:border-border transition-all cursor-pointer focus:outline-none"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground disabled:hover:border-border transition-all cursor-pointer focus:outline-none"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 -mx-4 px-4 md:-mx-8 md:px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {ROOMS.map((room, index) => (
            <motion.div
              key={room.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={slideUp(0.5, 40)}
              className="snap-start shrink-0 w-[280px] sm:w-[350px] aspect-[3/4] relative rounded-2xl overflow-hidden border border-border group"
            >
              {/* Background Photo */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${room.image})`,
                  backgroundColor: index % 2 === 0 ? "#E5E0D8" : "#EFECE6",
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10" />

              {/* Link Wrapper */}
              <Link
                href={`/rooms/${room.slug}`}
                className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-end text-white cursor-pointer"
              >
                <h3 className="font-heading text-xl sm:text-2xl font-normal tracking-wide text-[#FCFBF7]">
                  {room.name}
                </h3>
                {room.description && (
                  <p className="text-xs text-[#FCFBF7]/70 font-sans font-light mt-2 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                )}
                <span className="text-[10px] uppercase tracking-widest text-primary font-semibold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore Room <span className="text-xs">&rarr;</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
