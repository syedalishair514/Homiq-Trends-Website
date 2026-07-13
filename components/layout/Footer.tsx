"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { FOOTER_LINKS } from "@/constants/navigation";
import { SOCIAL_LINKS } from "@/constants/social";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { Truck, ArrowLeftRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

// Inline custom SVGs for social media platforms to avoid version-dependent lucide-react exports
const SocialIcon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Instagram":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "Facebook":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "Twitter":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case "Youtube":
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
          <polygon points="10 15 15 12 10 9" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = newsletterSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }
    setError("");
    toast.success("Subscribed successfully! Welcome to Homiq Trends.");
    setEmail("");
  };

  return (
    <footer className="bg-secondary text-foreground/80 border-t border-border mt-auto">
      {/* Top Banner: Trust Badges */}
      <div className="border-b border-border/60 py-8 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
              <Truck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-foreground">Free Shipping</h4>
              <p className="text-xs text-muted-foreground mt-1">On orders over $150 premium products</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
              <ArrowLeftRight className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-foreground">30-Day Returns</h4>
              <p className="text-xs text-muted-foreground mt-1">Hassle-free return & exchanges</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-foreground">Secure Payments</h4>
              <p className="text-xs text-muted-foreground mt-1">100% encrypted bank transfers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary shrink-0">
              <HelpCircle className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-foreground">24/7 Concierge</h4>
              <p className="text-xs text-muted-foreground mt-1">Dedicated luxury customer support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Newsletter Signup & Branding */}
        <div className="md:col-span-4 flex flex-col space-y-6">
          <Link href="/">
            <span className="font-heading text-xl sm:text-2xl font-semibold tracking-[0.15em] text-foreground uppercase">
              Homiq<span className="text-primary font-light">Trends</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans font-light leading-relaxed max-w-sm">
            Join the exclusive world of Homiq Trends. Subscribe to receive updates on curations, arrivals, and members-only events.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full max-w-sm">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${DESIGN_SYSTEM.radius.input} bg-background border-border/80 text-sm`}
              />
              <Button type="submit" className={`${DESIGN_SYSTEM.radius.button} bg-primary text-primary-foreground hover:bg-primary/95 px-5`}>
                Join
              </Button>
            </div>
            {error && <span className="text-xs text-destructive font-sans">{error}</span>}
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-4">Shop</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors text-muted-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-4">Company</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors text-muted-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-4">Support</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors text-muted-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground mb-4">Legal</h5>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors text-muted-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t border-border/60 py-8 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Links */}
          <div className="flex gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-muted-foreground"
                aria-label={link.name}
              >
                <SocialIcon name={link.name} />
              </a>
            ))}
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="text-xs tracking-wider uppercase mr-2 font-medium">Secured by</span>
            <div className="flex gap-2">
              <span className="text-[10px] tracking-widest font-semibold border border-border px-2 py-1 bg-background text-foreground/75 rounded">VISA</span>
              <span className="text-[10px] tracking-widest font-semibold border border-border px-2 py-1 bg-background text-foreground/75 rounded">MC</span>
              <span className="text-[10px] tracking-widest font-semibold border border-border px-2 py-1 bg-background text-foreground/75 rounded">AMEX</span>
              <span className="text-[10px] tracking-widest font-semibold border border-border px-2 py-1 bg-background text-foreground/75 rounded">PAYPAL</span>
              <span className="text-[10px] tracking-widest font-semibold border border-border px-2 py-1 bg-background text-foreground/75 rounded">APPLE PAY</span>
            </div>
          </div>

          {/* Copyright */}
          <span className="text-xs text-muted-foreground font-sans">
            &copy; {new Date().getFullYear()} Homiq Trends. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
