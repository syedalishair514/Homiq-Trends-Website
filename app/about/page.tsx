"use client";

import React from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { motion } from "framer-motion";
import { slideUp } from "@/constants/animations";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { value: "10K+", label: "Harmonious Homes" },
    { value: "24", label: "Artisan Partners" },
    { value: "100%", label: "Traceable Travertine" },
    { value: "99.4%", label: "Satisfaction Rate" }
  ];

  const milestones = [
    { year: "2024", title: "The Spark", desc: "Homiq Trends was founded as a design study in Milan, focusing on raw stone aesthetics." },
    { year: "2025", title: "Material Selection", desc: "We established relationships with heritage Tivoli quarries and organic wool weavers in Florence." },
    { year: "2026", title: "Digital Boutique", desc: "Launch of our premium online catalog, shipping bespoke travertine designs globally." }
  ];

  const team = [
    { name: "Alessia Rossi", role: "Chief Stonemason Curator", img: "/images/categories/living-room.jpg" },
    { name: "Devon Chen", role: "Product Designer", img: "/images/categories/bedroom.jpg" }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] space-y-20">
        
        {/* Intro */}
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp(0.5, 30)}
            className="max-w-4xl mx-auto space-y-12"
          >
            <SectionHeading
              title="Crafting Timeless Harmonious Spaces"
              subtitle="Our Philosophy"
              description="Discover the story of Homiq Trends—how we curate artisan home decor, travertine fixtures, and organic textiles."
            />

            {/* Editorial Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white dark:bg-[#222220] p-8 sm:p-12 rounded-3xl border border-border shadow-xs">
              <div className="space-y-6">
                <h3 className="font-heading text-xl font-normal text-foreground">
                  Our Journey
                </h3>
                <p className="text-xs text-muted-foreground font-sans font-light leading-relaxed">
                  Founded with a vision to merge simplicity with premium organic elements, Homiq Trends curates home essentials that celebrate slow living. We partner with local weavers and stonemasons to deliver hand-finished travertine items, brass lighting fixtures, and high-grade Belgian linen shams.
                </p>
                <p className="text-xs text-muted-foreground font-sans font-light leading-relaxed">
                  Every product is crafted to last generations, serving as functional sculptures that reflect comfort, utility, and refined aesthetics.
                </p>
              </div>

              {/* Decorative brand block */}
              <div className="w-full aspect-[4/3] rounded-2xl bg-[#F8F5F2] dark:bg-[#1C1C1A] border border-border flex flex-col justify-center items-center text-center p-6">
                <span className="text-accent text-[9px] uppercase tracking-[0.25em] font-semibold mb-2">Established 2024</span>
                <h4 className="font-heading text-base font-semibold text-foreground max-w-xs leading-snug">Handcrafted with Organic Integrity</h4>
                <p className="text-[11px] text-muted-foreground font-light mt-2 max-w-xs leading-relaxed">We utilize FSC-certified walnut woods, raw Roman travertine, and 100% natural wool fibers.</p>
              </div>
            </div>
          </motion.div>
        </Container>

        {/* Brand stats */}
        <div className="bg-secondary/40 dark:bg-[#1C1C1A] py-16 border-y border-border">
          <Container>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <span className="text-3xl font-bold font-sans text-foreground block">{stat.value}</span>
                  <span className="text-xs text-muted-foreground font-light uppercase tracking-wider block">{stat.label}</span>
                </div>
              ))}
            </div>
          </Container>
        </div>

        {/* Mission & Vision */}
        <Container className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-heading text-sm font-semibold text-foreground">Our Mission</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                To elevate day-to-day spatial experiences by providing objects of timeless design and structural honesty, cutting out middleman markup and preserving age-old stone carving traditions.
              </p>
            </div>

            <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="font-heading text-sm font-semibold text-foreground">Our Vision</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                To become the global destination for conscious design collectors, advocating for sustainable quarry extraction practices and slow living aesthetics in modern residences.
              </p>
            </div>
          </div>
        </Container>

        {/* Timeline */}
        <Container className="max-w-4xl">
          <div className="space-y-8">
            <h3 className="font-heading text-lg font-semibold text-foreground text-center">Curating History</h3>
            
            <div className="relative border-l border-border ml-4 md:ml-32 space-y-8 py-2">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative pl-8">
                  {/* Timeline Dot */}
                  <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-white dark:border-[#181816]" />
                  
                  {/* Milestones context */}
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-accent">{m.year}</span>
                    <h4 className="font-heading text-sm font-semibold text-foreground">{m.title}</h4>
                    <p className="text-xs text-muted-foreground font-light max-w-xl leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* Team */}
        <Container className="max-w-4xl">
          <div className="space-y-8">
            <h3 className="font-heading text-lg font-semibold text-foreground text-center">Core Curators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {team.map((t, idx) => (
                <div key={idx} className="bg-white dark:bg-[#222220] border border-border p-4 rounded-3xl space-y-4 text-center">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border">
                    <Image src={t.img} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-semibold text-foreground">{t.name}</h4>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mt-0.5">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* CTA */}
        <Container className="max-w-4xl">
          <div className="bg-[#1C1C1A] text-white p-8 sm:p-12 rounded-3xl text-center space-y-6">
            <h3 className="font-heading text-2xl font-light text-white leading-relaxed">
              Explore Our Handcrafted Collection
            </h3>
            <p className="text-xs text-[#EAEAEA] font-light max-w-md mx-auto leading-relaxed">
              Find minimalist stone platters, organic linens, and solid walnut shams built for architectural integrity.
            </p>
            <div className="pt-2">
              <Link href="/products" className="inline-flex items-center gap-2 bg-[#D9B79A] text-black hover:bg-[#D9B79A]/95 text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-xl transition-all shadow-xs">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
