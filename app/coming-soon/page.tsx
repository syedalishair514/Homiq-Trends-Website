"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! We will notify you upon launch.");
    setEmail("");
  };

  const timeBlocks = [
    { label: "Days", val: timeLeft.days },
    { label: "Hours", val: timeLeft.hours },
    { label: "Mins", val: timeLeft.minutes },
    { label: "Secs", val: timeLeft.seconds }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <Container className="max-w-xl text-center space-y-8">
          <div className="bg-white dark:bg-[#222220] border border-border p-8 sm:p-12 rounded-3xl shadow-xs space-y-6">
            
            {/* Header */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-accent bg-accent/5 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Curating Milan Release
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-light text-foreground leading-snug">
                Italian Travertine &amp; Linens
              </h2>
              <p className="text-xs text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
                We are hand-carving our premium travertine tables and weaving our organic lambswool shams. Subscribe for early access locks.
              </p>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
              {timeBlocks.map((block, i) => (
                <div key={i} className="bg-secondary/40 border border-border p-3.5 rounded-xl">
                  <span className="text-lg font-bold font-sans text-foreground block">{block.val}</span>
                  <span className="text-[8px] uppercase tracking-wider text-muted-foreground block mt-0.5">{block.label}</span>
                </div>
              ))}
            </div>

            {/* Subscription Form */}
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2 pt-2">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="bg-secondary/40 border-border text-xs py-5 rounded-xl flex-1 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest px-6 rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
              >
                Notify Me <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
