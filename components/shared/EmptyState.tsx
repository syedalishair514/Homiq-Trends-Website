"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { scale } from "@/constants/animations";
import { DESIGN_SYSTEM } from "@/constants/theme";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  ctaText?: string;
  ctaLink?: string;
}

export default function EmptyState({
  title,
  description,
  icon: Icon,
  ctaText,
  ctaLink,
}: EmptyStateProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scale(0.5)}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border bg-card max-w-md mx-auto rounded-2xl"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-5">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-lg sm:text-xl font-heading font-normal tracking-wide text-foreground mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground font-sans font-light leading-relaxed max-w-xs mb-6">
        {description}
      </p>
      {ctaText && ctaLink && (
        <Button
          render={<Link href={ctaLink}>{ctaText}</Link>}
          className={`${DESIGN_SYSTEM.radius.button} px-6 hover:opacity-90 cursor-pointer`}
        />
      )}
    </motion.div>
  );
}
