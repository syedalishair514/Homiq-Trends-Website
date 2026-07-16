"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { AlertCircle, RefreshCw, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DESIGN_SYSTEM } from "@/constants/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrderFailedPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <Container className="max-w-2xl">
          <div className="bg-white dark:bg-[#222220] border border-border p-8 sm:p-12 rounded-3xl text-center space-y-8 shadow-xs">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-100 dark:border-red-500/25">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-destructive font-bold">Transaction Declined</span>
              <h1 className="font-heading text-3xl font-semibold text-foreground">Order Payment Failed</h1>
              <p className="text-sm text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
                Our secure banking system was unable to authorize this transaction. This could be due to generic card declines, incorrect CVV verification, or simulator testing settings.
              </p>
            </div>

            {/* Error logs mock cards */}
            <div className="bg-secondary/40 dark:bg-[#1C1C1A] p-6 rounded-2xl text-left text-xs space-y-4 border border-border">
              <h4 className="font-sans font-bold text-foreground text-xs uppercase tracking-wider">Troubleshooting Coordinates</h4>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside font-light">
                <li>Verify your credit card number and expiry year parameters.</li>
                <li>Make sure the CVV/CVC code matches the back of your physical card.</li>
                <li>Uncheck the &quot;Simulate Transaction Decline&quot; checkbox inside the checkout page.</li>
              </ul>
            </div>

            {/* Retry Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout">
                <Button className={`${DESIGN_SYSTEM.radius.button} bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest px-8 py-5 flex items-center gap-2 cursor-pointer shadow-xs`}>
                  <RefreshCw className="w-4 h-4 animate-spin-slow" /> Retry Checkout Payment
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-border bg-white dark:bg-[#222220] hover:bg-secondary text-xs font-bold uppercase tracking-widest px-8 py-5 cursor-pointer flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-accent" /> Contact Concierge
                </Button>
              </Link>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/cart"
                className="text-xs text-accent hover:text-accent/80 transition-colors font-medium font-sans inline-flex items-center gap-1"
              >
                &larr; Return to Shopping Bag
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
