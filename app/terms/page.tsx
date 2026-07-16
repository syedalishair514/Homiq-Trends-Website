"use client";

import React from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  const terms = [
    {
      title: "1. Natural Material Disclaimer",
      content: "Homiq Trends specializes in raw Roman travertine, organic lambswool, and handmade shams. Travertine is a natural stone product with unique textures, pores, grain variations, and mineral deposits. Slight color variations or organic pores are characteristic qualities, not product defects."
    },
    {
      title: "2. Trade & Custom Orders",
      content: "Custom dimension stone tables, custom vanity pedestals, or custom sizes ordered through our trade concierge require 50% upfront deposits and are non-cancelable once fabrication has commenced at our Tivoli quarries."
    },
    {
      title: "3. User Conduct & Digital Assets",
      content: "All brand assets, photography, and text content featured on this platform are owned by Homiq Trends. Content reproduction is strictly prohibited without explicit written trade licensing."
    },
    {
      title: "4. Disputes",
      content: "These terms are governed by the laws of Italy. Any disputes relating to purchase orders or trade agreements will be resolved in the courts of Milan."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            <SectionHeading
              title="Terms of Service"
              subtitle="Legal Node"
              description="Last Updated: July 15, 2026. Review user guidelines, stone variation disclosures, and custom commission stipulations."
            />

            <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl space-y-8 text-xs font-light text-muted-foreground leading-relaxed">
              <p>
                Please read these terms of service carefully before accessing our boutique. By browsing or purchasing from Homiq Trends, you agree to comply with the following regulations.
              </p>

              {terms.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-heading text-sm font-semibold text-foreground">{sec.title}</h4>
                  <p>{sec.content}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
