"use client";

import React from "react";
import Container from "@/components/shared/Container";
import { Hammer } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MaintenancePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <Container className="max-w-md text-center space-y-6">
          <div className="bg-white dark:bg-[#222220] border border-border p-10 rounded-3xl shadow-xs space-y-5">
            <div className="w-12 h-12 bg-accent/5 text-accent rounded-full flex items-center justify-center mx-auto">
              <Hammer className="w-6 h-6 stroke-[1.5]" />
            </div>
            
            <h2 className="font-heading text-2xl font-light text-foreground leading-relaxed">
              Concierge Tuning
            </h2>
            
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              We are currently reorganizing our raw stone inventory states and verifying shipping route metrics. We will be operational shortly.
            </p>

            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block pt-2 border-t border-border/40">
              Estimated Duration: 15 minutes
            </span>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
