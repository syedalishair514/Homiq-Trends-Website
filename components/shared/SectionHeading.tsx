"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { slideUp } from "@/constants/animations";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={slideUp(0.6, 20)}
      className={cn(
        "flex flex-col mb-10 sm:mb-14 max-w-3xl mx-auto",
        alignmentClasses[align],
        className
      )}
    >
      {subtitle && (
        <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-2">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-heading font-normal tracking-wide text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm sm:text-base text-muted-foreground font-sans font-light leading-relaxed">
          {description}
        </p>
      )}
      <div className="w-12 h-[1px] bg-primary mt-5" />
    </motion.div>
  );
}
