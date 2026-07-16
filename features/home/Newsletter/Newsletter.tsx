"use client";

import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { slideUp } from "@/constants/animations";
import Container from "@/components/shared/Container";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = schema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }
    setError("");
    toast.success("Welcome! You are now subscribed to Homiq Trends.");
    setEmail("");
  };

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF8] dark:bg-[#181816] overflow-hidden border-t border-border">
      <Container className="max-w-4xl mx-auto px-4">
        {/* Soft Cream Newsletter Card Container */}
        <div className="bg-[#F8F5F2] dark:bg-[#222220] rounded-3xl p-8 sm:p-12 md:p-16 border border-border shadow-xs relative overflow-hidden text-center">
          {/* Decorative Floating Geometric Elements */}
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full border border-primary/10 pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full border border-primary/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-[90px] pointer-events-none" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={slideUp(0.5, 30)}
            className="flex flex-col items-center gap-6 relative z-10"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-accent">
              <Mail className="w-5 h-5 stroke-[1.5]" />
            </div>

            <span className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">
              Exclusive Community
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl font-light text-foreground tracking-wide leading-tight max-w-xl">
              Join The World of <br />
              <span className="font-semibold text-primary">Homiq Trends</span>
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground font-sans font-light leading-relaxed max-w-md">
              Subscribe to receive priority notifications on curated arrivals, early sales, and members-only design inspirations.
            </p>

            {/* Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full max-w-md mt-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${DESIGN_SYSTEM.radius.input} bg-white dark:bg-[#181816] border-border text-foreground placeholder:text-muted-foreground/60 h-12 text-sm focus-visible:ring-primary focus-visible:border-primary`}
                />
                <Button type="submit" className={`${DESIGN_SYSTEM.radius.button} bg-primary text-primary-foreground hover:bg-primary/95 px-8 h-12 uppercase tracking-widest text-xs font-bold shrink-0 cursor-pointer shadow-xs`}>
                  Subscribe
                </Button>
              </div>
              {error && <span className="text-xs text-destructive text-left font-sans">{error}</span>}
            </form>

            {/* Privacy Note */}
            <div className="flex items-center gap-1.5 text-muted-foreground/75 text-[10px] sm:text-xs font-light font-sans mt-2">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <span>We respect your privacy. Unsubscribe anytime.</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
