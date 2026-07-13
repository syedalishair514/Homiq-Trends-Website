"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { scale } from "@/constants/animations";
import { DESIGN_SYSTEM } from "@/constants/theme";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error loading this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scale(0.5)}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-destructive/20 bg-destructive/5 max-w-md mx-auto rounded-2xl"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 text-destructive mb-5">
        <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-lg sm:text-xl font-heading font-normal tracking-wide text-foreground mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground font-sans font-light leading-relaxed max-w-xs mb-6">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="destructive" className={`${DESIGN_SYSTEM.radius.button} px-6 hover:opacity-90`}>
          Try Again
        </Button>
      )}
    </motion.div>
  );
}
