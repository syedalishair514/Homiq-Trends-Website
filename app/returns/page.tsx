"use client";

import React from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ReturnsPage() {
  const steps = [
    {
      title: "Step 1: Contact Concierge Support",
      content: "Email concierge@homiqtrends.com with your Order ID (e.g. HQ-83921) to request a return label. Let us know the reason for return so we can coordinate specific stone freight haulers."
    },
    {
      title: "Step 2: Pack Securely",
      content: "Carefully place the stone platter or fabric blanket back into its original box. For travertine tables or pedestals, you must secure the item within the original custom wooden crate to prevent shipping stress cracks."
    },
    {
      title: "Step 3: Courier Pickup",
      content: "Due to freight weight limits, we will schedule a home pickup with our carrier partner. The courier will collect the crate directly from your curbside."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            <SectionHeading
              title="Returns Guild"
              subtitle="Logistics Node"
              description="Last Updated: July 15, 2026. Review our step-by-step guidelines for packaging and scheduling heavy stone courier pickups."
            />

            <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl space-y-8 text-xs font-light text-muted-foreground leading-relaxed">
              <p>
                Returning a heavy travertine item is structured to be simple. This guide walks you through secure packaging and pickup dispatch details.
              </p>

              {steps.map((sec, idx) => (
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
