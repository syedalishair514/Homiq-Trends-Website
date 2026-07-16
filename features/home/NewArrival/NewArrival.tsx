"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { slideUp, fadeIn } from "@/constants/animations";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import { Sparkles } from "lucide-react";

export default function NewArrival() {
  return (
    <section className="py-20 sm:py-28 bg-[#F8F5F2] dark:bg-[#1C1C1A]/20 border-t border-border/80 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={slideUp(0.5, 30)}
            className="lg:col-span-5 flex flex-col items-start space-y-6"
          >
            <span className="text-accent text-xs font-semibold uppercase tracking-[0.25em] bg-[#EEDCCB]/65 px-3 py-1.5 rounded-md font-sans flex items-center gap-2">
              <Sparkles className="w-4 h-4 fill-[#C69A63]" /> Spotlight Arrival
            </span>
            
            <h2 className="font-heading text-3xl sm:text-5xl font-light text-foreground tracking-wide leading-tight">
              The Ribbed <br />
              <span className="font-semibold text-primary">Cashmere Lounge</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-muted-foreground font-sans font-light leading-relaxed">
              Experience the pinnacle of warmth and comfort. Hand-finished by local weavers in the Mongolian steppe, our ribbed loungewear collection uses double-ply ultra-fine cashmere fibers that are lightweight, breathable, and designed for lasting luxury.
            </p>
            
            <div className="pt-2 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button render={<Link href="/products/cashmere-ribbed-lounge-throw" />} className={`${DESIGN_SYSTEM.radius.button} px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold tracking-widest uppercase cursor-pointer`}>
                Shop The Blanket
              </Button>
              <Button variant="outline" render={<Link href="/products?filter=new" />} className="rounded-xl px-8 py-6 border-primary text-accent hover:bg-[#EEDCCB]/30 text-xs font-bold tracking-widest uppercase cursor-pointer">
                View All Arrivals
              </Button>
            </div>
          </motion.div>

          {/* Right Lifestyle Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn(0.6)}
            className="lg:col-span-7 relative flex justify-center items-center"
          >
            {/* Decorative background shadow glow */}
            <div className="absolute w-[80%] h-[80%] bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* Floating Image Container */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-xl aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-md bg-muted"
            >
              <Image
                src="/images/products/prod3-1.jpg"
                alt="Belgian ribbed cashmere throw banner styling"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#EEDCCB]/15 mix-blend-overlay pointer-events-none" />
            </motion.div>

            {/* Small floating detail card */}
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-[#222220] border border-border p-4 rounded-xl shadow-md flex items-center gap-3 hidden sm:flex z-10"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0">
                <Image
                  src="/images/products/prod3-2.jpg"
                  alt="Cashmere blanket detail view"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground"> Ribbed Lounge Throw</h4>
                <span className="text-[10px] text-accent font-bold">$145.00</span>
                <span className="text-[9px] text-muted-foreground ml-2 line-through">$180.00</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
