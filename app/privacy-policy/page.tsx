"use client";

import React from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us when creating a customer account, completing a purchase order, submitting reviews, or subscribing to our newsletters. This includes name, delivery address, phone details, and email."
    },
    {
      title: "2. Stone Quarry Sourcing Disclosures",
      content: "All travertine orders require coordination with local customs agencies and freight couriers. Relevant shipment data (e.g. shipping address, tax references) is shared strictly with authorized carriers."
    },
    {
      title: "3. Cookie Preferences & Marketing Switches",
      content: "We utilize cookies to preserve shopping cart contents and remember preferences. You can adjust appearance preferences (e.g. Dark Neutral theme) or deactivate SMS notifications via your User Profile Dashboard at any time."
    },
    {
      title: "4. Contact Us",
      content: "For inquiries regarding personal data, email us at concierge@homiqtrends.com or write to: Via della Spiga 15, Milan, Italy."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            <SectionHeading
              title="Privacy Policy"
              subtitle="Legal Node"
              description="Last Updated: July 15, 2026. Review our protocols regarding customer details, transaction history, and quarry logistics."
            />

            <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl space-y-8 text-xs font-light text-muted-foreground leading-relaxed">
              <p>
                At Homiq Trends, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard information when you browse our boutique.
              </p>

              {sections.map((sec, idx) => (
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
