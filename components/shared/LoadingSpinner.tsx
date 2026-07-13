"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  fullPage = false,
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-[2px]",
    md: "w-10 h-10 border-[3px]",
    lg: "w-16 h-16 border-[4px]",
  };

  const spinner = (
    <div className={cn("relative flex items-center justify-center", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className={cn(
          "rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent",
          sizeClasses[size]
        )}
      />
      <div
        className={cn(
          "absolute rounded-full border-primary/10",
          sizeClasses[size]
        )}
      />
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
        {spinner}
        <p className="mt-4 text-xs tracking-[0.2em] uppercase text-primary font-medium animate-pulse">
          Homiq Trends
        </p>
      </div>
    );
  }

  return spinner;
}
