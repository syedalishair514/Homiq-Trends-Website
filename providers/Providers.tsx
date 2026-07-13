"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";
import { CartProviderWrapper } from "@/context/CartContext";
import { SearchProviderWrapper } from "@/context/SearchContext";
import { WishlistProviderWrapper } from "@/context/WishlistContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <CartProviderWrapper>
        <SearchProviderWrapper>
          <WishlistProviderWrapper>
            {children}
            <ToastProvider />
          </WishlistProviderWrapper>
        </SearchProviderWrapper>
      </CartProviderWrapper>
    </ThemeProvider>
  );
}
