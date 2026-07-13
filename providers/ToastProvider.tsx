"use client";

import React from "react";
import { Toaster as SonnerToaster } from "sonner";

export const ToastProvider: React.FC = () => {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          fontFamily: "var(--font-inter)",
          borderRadius: "calc(var(--radius) * 1.4)", // matches rounded-2xl
        },
      }}
    />
  );
};
