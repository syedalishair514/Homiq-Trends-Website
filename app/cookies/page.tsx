"use client";

import React from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CookiesPage() {
  const policies = [
    {
      title: "1. Core Functional Cookies",
      content: "These cookies are vital to navigate Homiq Trends. They preserve items inside your shopping cart, maintain security, and save theme toggle parameters (e.g. Dark Neutral mode)."
    },
    {
      title: "2. Analytical Cookies",
      content: "We collect anonymous traffic data to evaluate loading speeds, page flow patterns, and find search queries that return empty catalog results, helping us optimize website layout."
    },
    {
      title: "3. Deactivating Cookies",
      content: "You can block cookies inside browser settings. Please note that blocking functional cookies will prevent you from saving cart selections or completing checkouts."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            <SectionHeading
              title="Cookies Policy"
              subtitle="Digital Node"
              description="Last Updated: July 15, 2026. Review functional cookies, theme states, and analytical tracking details."
            />

            <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl space-y-8 text-xs font-light text-muted-foreground leading-relaxed">
              <p>
                We use cookies to enhance your digital experience. This document outlines why we use cookies and how you can opt out.
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
