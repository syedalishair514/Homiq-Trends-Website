"use client";

import React, { useState, useEffect, useRef } from "react";
import { HOME_FEATURES } from "@/constants/features";
import { motion } from "framer-motion";
import { slideUp, staggerContainer } from "@/constants/animations";
import SectionHeading from "@/components/shared/SectionHeading";
import Container from "@/components/shared/Container";

const Counter = ({ value, duration = 1.2 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

export default function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 bg-secondary dark:bg-[#121212]/30 border-y border-border">
      <Container>
        <SectionHeading
          title="Why Choose Homiq"
          subtitle="Our Standards"
          align="center"
          description="We are dedicated to crafting an exceptional customer journey through fine organic materials, reliable transit nodes, and prompt concierge service."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer(0.08)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {HOME_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                variants={slideUp(0.4, 25)}
                className="bg-white dark:bg-[#222220] border border-border p-8 rounded-2xl flex flex-col justify-between items-start gap-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Icon Wrapper */}
                <div className="w-12 h-12 rounded-full bg-[#EEDCCB] dark:bg-primary/20 text-accent flex items-center justify-center transition-all group-hover:scale-110">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-semibold tracking-wide text-foreground">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans font-light leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Counter Metric */}
                <div className="text-2xl font-semibold text-accent font-sans mt-2">
                  <Counter value={feat.value} />
                  <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider ml-1">
                    {feat.suffix}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
