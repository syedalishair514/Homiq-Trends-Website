"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ArrowRight, MoveLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <Container className="max-w-md text-center space-y-6">
          <div className="bg-white dark:bg-[#222220] border border-border p-10 rounded-3xl shadow-xs space-y-5">
            <span className="text-accent text-xs font-mono font-bold uppercase tracking-widest block">Error 404</span>
            
            <h2 className="font-heading text-2xl font-light text-foreground leading-relaxed">
              Design Path Lost
            </h2>
            
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              The page you are seeking is either archived, renamed, or currently unavailable at our Milan node.
            </p>

            <div className="pt-4 flex flex-col gap-2">
              <Link href="/" className="w-full">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest py-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                  <MoveLeft className="w-4 h-4" /> Back to Home
                </Button>
              </Link>
              <Link href="/products" className="w-full">
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary text-xs font-bold uppercase tracking-widest py-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                  Browse Products <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
