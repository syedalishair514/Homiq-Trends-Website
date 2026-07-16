"use client";

import React from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RefundPolicyPage() {
  const policies = [
    {
      title: "1. Return Window",
      content: "We accept returns on standard catalog products within 14 days of shipment delivery. To be eligible for a refund, the product must be unused, undamaged, and stored in its original freight box or wooden crate."
    },
    {
      title: "2. Processing Timelines",
      content: "Once the stone object is received and inspected at our Milan warehouse node, we will authorize your refund. Funds are credited to the original payment card (Stripe, Credit Card, or PayPal) in 5-7 business days."
    },
    {
      title: "3. Non-Refundable Items",
      content: "Trade orders, custom dimension travertine slabs, custom lighting sconces, and items purchased during promotional sales are final sale and cannot be returned or refunded."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            <SectionHeading
              title="Refund Policy"
              subtitle="Finance Node"
              description="Last Updated: July 15, 2026. Review rules for return windows, inspection thresholds, and transaction refunds."
            />

            <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl space-y-8 text-xs font-light text-muted-foreground leading-relaxed">
              <p>
                We stand behind the quality of our travertine and organic wool. If you need to request a refund, please review our terms below.
              </p>

              {policies.map((sec, idx) => (
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
