"use client";

import React, { useState } from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { slideUp } from "@/constants/animations";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success("Thank you! Your message has been sent to our concierge team.");
    setFormData({ name: "", email: "", message: "" });
  };

  const contactFaqs = [
    { q: "Do you ship your travertine globally?", a: "Yes. We offer fully insured priority shipping on stone platters, tables, and fragile designs worldwide." },
    { q: "Can I request custom stone sizes?", a: "Certainly. Our trade portal assists interior designers and architects with bespoke commissions." }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] space-y-16">
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp(0.5, 30)}
            className="max-w-4xl mx-auto space-y-12"
          >
            <SectionHeading
              title="Get in Touch"
              subtitle="Concierge Support"
              description="Our design advisors are available to assist with custom sizes, global shipments, or trade partnerships."
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Form Block */}
              <form
                onSubmit={handleSubmit}
                className="md:col-span-7 bg-white dark:bg-[#222220] p-6 sm:p-10 rounded-3xl border border-border space-y-5"
              >
                <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-3">Send Message</h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Your Name</label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-secondary/40 border-border text-xs py-5 rounded-xl w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Email Address</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@domain.com"
                    className="bg-secondary/40 border-border text-xs py-5 rounded-xl w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Your Message</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your design request or trade inquiry..."
                    className="bg-secondary/40 border-border text-xs py-3.5 rounded-xl w-full min-h-[120px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest py-6 rounded-xl cursor-pointer"
                >
                  Send Inquiry
                </Button>
              </form>

              {/* Sidebar details */}
              <div className="md:col-span-5 space-y-6">
                
                {/* Details card */}
                <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-5 text-xs">
                  <h4 className="font-heading text-sm font-semibold text-foreground border-b border-border pb-2">HQ Concierge</h4>
                  
                  <div className="space-y-3 font-light text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-accent shrink-0" />
                      <span>Via della Spiga 15, Milan, Italy</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-accent shrink-0" />
                      <span>+39 02 7600 1234</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-accent shrink-0" />
                      <span>concierge@homiqtrends.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-accent shrink-0" />
                      <span>Mon - Fri: 9:00 - 18:00 CET</span>
                    </div>
                  </div>

                  {/* Social Handles */}
                  <div className="flex gap-4 pt-3 border-t border-border/60">
                    <a href="https://instagram.com" className="text-muted-foreground hover:text-foreground">
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a href="https://facebook.com" className="text-muted-foreground hover:text-foreground">
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-border bg-[#F5F2EF] dark:bg-[#222220] flex items-center justify-center p-4">
                  {/* Clean SVG grid representing a premium minimalist street map */}
                  <svg className="absolute inset-0 w-full h-full text-border opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <line x1="20%" y1="0" x2="20%" y2="100%" stroke="currentColor" strokeWidth="1" />
                    <line x1="60%" y1="0" x2="60%" y2="100%" stroke="currentColor" strokeWidth="1" />
                    <line x1="0" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="1" />
                    <line x1="0" y1="70%" x2="100%" y2="70%" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  
                  <div className="z-10 text-center space-y-2">
                    <span className="inline-flex w-7 h-7 bg-primary text-primary-foreground rounded-full items-center justify-center animate-bounce shadow-md">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <h5 className="font-heading text-xs font-semibold text-foreground">Milan Showroom</h5>
                    <p className="text-[10px] text-muted-foreground font-light">Via della Spiga, Quadrilatero della Moda</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Contact FAQ */}
            <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl space-y-6">
              <h3 className="font-heading text-base font-semibold text-foreground text-center">Frequently Asked Questions</h3>
              
              <div className="space-y-3 max-w-2xl mx-auto">
                {contactFaqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-border last:border-b-0 pb-3">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full text-left text-xs font-semibold text-foreground py-2 flex justify-between items-center cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-muted-foreground">{activeFaq === idx ? "−" : "+"}</span>
                    </button>
                    {activeFaq === idx && (
                      <p className="text-xs text-muted-foreground font-light leading-relaxed pt-1.5 pl-1">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
