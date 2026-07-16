"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { CheckCircle2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DESIGN_SYSTEM } from "@/constants/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<{ id: string; total: string; address: string; items: unknown[] }>({
    id: "HT-102948",
    total: "0",
    address: "Milan, Italy",
    items: []
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("last_order_id") || "HT-102948";
      const total = sessionStorage.getItem("last_order_total") || "0";
      const address = sessionStorage.getItem("last_order_address") || "Milan, Italy";
      const items = JSON.parse(sessionStorage.getItem("last_order_items") || "[]");
      setTimeout(() => {
        setOrderDetails({ id, total, address, items });
      }, 0);
    }
  }, []);

  // Estimate delivery date: 4 days from now
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <Container className="max-w-2xl">
          <div className="bg-white dark:bg-[#222220] border border-border p-8 sm:p-12 rounded-3xl text-center space-y-8 shadow-xs">
            {/* Checked Icon */}
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-500/25">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-bold">Transaction Secured</span>
              <h1 className="font-heading text-3xl font-semibold text-foreground">Thank You for Your Purchase!</h1>
              <p className="text-sm text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
                Your order has been authorized and dispatched to our logistics team. We have sent a courier summary with tracking coordinates to your email.
              </p>
            </div>

            {/* Order summary coordinates cards */}
            <div className="bg-secondary/40 dark:bg-[#1C1C1A] p-6 rounded-2xl text-left text-xs space-y-4 border border-border">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-muted-foreground">Order Identifier</span>
                <span className="font-mono font-bold text-foreground">{orderDetails.id}</span>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4.5 h-4.5 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">Estimated Delivery</span>
                  <span className="font-bold text-foreground block mt-0.5">{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">Delivery Destination</span>
                  <span className="font-bold text-foreground block mt-0.5">{orderDetails.address}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-3">
                <span className="text-muted-foreground">Paid Amount</span>
                <span className="font-sans font-bold text-base text-foreground">${orderDetails.total}</span>
              </div>
            </div>

            {/* Continue Shopping Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className={`${DESIGN_SYSTEM.radius.button} bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest px-8 py-5 flex items-center gap-2 cursor-pointer shadow-xs`}>
                  Continue Shopping <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="border-border bg-white dark:bg-[#222220] hover:bg-secondary text-xs font-bold uppercase tracking-widest px-8 py-5 cursor-pointer">
                  Track Delivery
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
