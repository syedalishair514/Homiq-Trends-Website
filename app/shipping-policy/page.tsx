"use client";

import React from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ShippingPolicyPage() {
  const policies = [
    {
      title: "1. Priority Freight Dispatch",
      content: "Due to the heavy weight and delicate nature of Roman travertine stone, we utilize specialized logistics carriers. Standard orders are shipped via priority freight with complete transit coverage. Shipments typically arrive in 3-5 business days across continental Europe and 5-10 days globally."
    },
    {
      title: "2. Costs & Duties",
      content: "Shipping is complimentary for all catalog purchases exceeding $150. Below this threshold, we charge a flat shipping and handling fee of $15. Import duties or customs clearances for cross-border trade locations are calculated during checkout."
    },
    {
      title: "3. Damage Claims",
      content: "All fragile items are packed in custom wooden crates. If your travertine object arrives damaged, please document the packaging condition and email our concierge support within 48 hours at concierge@homiqtrends.com."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            <SectionHeading
              title="Shipping Policy"
              subtitle="Logistics Node"
              description="Last Updated: July 15, 2026. Review shipping fees, custom wood crate packaging, and transit durations."
            />

            <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl space-y-8 text-xs font-light text-muted-foreground leading-relaxed">
              <p>
                We handle our premium stone and organic shams with utmost care. This policy describes our logistics carrier nodes and custom shipping rates.
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
