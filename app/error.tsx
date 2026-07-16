"use client";

import React, { useEffect } from "react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ErrorBoundary captured:", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <Container className="max-w-md text-center space-y-6">
          <div className="bg-white dark:bg-[#222220] border border-border p-10 rounded-3xl shadow-xs space-y-5">
            <span className="text-destructive text-xs font-mono font-bold uppercase tracking-widest block">Error 500</span>
            
            <h2 className="font-heading text-2xl font-light text-foreground leading-relaxed">
              System Disturbance
            </h2>
            
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Our servers encountered an unexpected deviation during state pre-rendering.
            </p>

            <div className="pt-4">
              <Button
                onClick={() => reset()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest py-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Reset Application Node
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
