"use client";

import React, { useState, useMemo } from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface FaqItem {
  q: string;
  a: string;
  category: "general" | "ordering" | "custom" | "shipping";
}

const faqs: FaqItem[] = [
  {
    q: "Where do you source your travertine stone?",
    a: "Our Roman travertine is sourced directly from historic quarries in Tivoli, Italy. Each piece is hand-selected for its unique organic texture, unfilled voids, and warm beige hue.",
    category: "general"
  },
  {
    q: "Are the shams and blankets made of 100% natural wool?",
    a: "Yes. Our organic blankets are spun from 100% virgin lambswool and cashmere in Florence, Italy, utilizing zero synthetic blends or chemical finishes.",
    category: "general"
  },
  {
    q: "How can I customize my travertine dining table?",
    a: "Interior designers and architects can apply for custom commissions through our Trade portal. We accommodate custom tabletop widths, edge fillets, and leg heights.",
    category: "custom"
  },
  {
    q: "What is your shipping fee for fragile stone items?",
    a: "Standard shipping is complimentary for orders above $150. For smaller stone platters and heavy pedestals, we charge a flat priority freight fee of $15, which includes full insurance.",
    category: "shipping"
  },
  {
    q: "How long does dispatch take for custom items?",
    a: "Bespoke stone items typically ship within 4-6 weeks of design approval, while in-stock decor items are dispatched within 2-3 business days.",
    category: "ordering"
  },
  {
    q: "What is your return policy on natural stone?",
    a: "Because natural travertine is inherently unique with distinct grain lines and texture pores, we accept returns on standard catalog items within 14 days of receipt, provided they are in original packaging. Custom trade commissions are final sale.",
    category: "shipping"
  }
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "ordering" | "custom" | "shipping">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Filtering FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        activeCategory === "all" || faq.category === activeCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            <SectionHeading
              title="Concierge FAQs"
              subtitle="Help Desk"
              description="Find detailed answers on stone sourcing, custom trade quotes, and logistics courier operations."
            />

            {/* Controls */}
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative flex items-center">
                <Search className="w-4.5 h-4.5 text-muted-foreground absolute left-3.5 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search questions (e.g. travertine, shipping)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 bg-white dark:bg-[#222220] border-border text-xs py-6 rounded-xl w-full"
                />
              </div>

              {/* Categories Tabs */}
              <div className="flex gap-2 flex-wrap text-xs">
                {[
                  { id: "all", label: "All Topics" },
                  { id: "general", label: "General" },
                  { id: "ordering", label: "Ordering" },
                  { id: "custom", label: "Custom Stone" },
                  { id: "shipping", label: "Shipping & Returns" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCategory(tab.id as "all" | "general" | "ordering" | "custom" | "shipping");
                      setOpenIndex(null);
                    }}
                    className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-medium ${
                      activeCategory === tab.id
                        ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                        : "bg-white dark:bg-[#222220] border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion list */}
            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-[#222220] border border-border rounded-2xl overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full text-left p-5 flex justify-between items-center text-xs font-semibold text-foreground cursor-pointer select-none"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {/* Content panel */}
                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          isOpen ? "max-h-[200px] border-t border-border/60" : "max-h-0"
                        }`}
                      >
                        <p className="p-5 text-xs text-muted-foreground font-light leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-xs text-muted-foreground font-light border border-dashed border-border rounded-2xl bg-white dark:bg-[#222220]">
                  No matching design questions found. Please refine your query terms.
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
