"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User, Heart, Sun, Moon } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/providers/ThemeProvider";
import { NAV_LINKS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const pathname = usePathname();
  const { scrollDirection, isAtTop } = useScrollDirection();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme, mounted } = useTheme();
  const { isOpen: searchOpen, openSearch, closeSearch, query, setQuery } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHidden = scrollDirection === "down" && !isAtTop;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full",
          isAtTop
            ? "bg-transparent border-transparent py-5"
            : "bg-background/80 backdrop-blur-md border-b border-border/40 py-3 shadow-sm",
          isHidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <span className="font-heading text-xl sm:text-2xl font-semibold tracking-[0.15em] text-foreground uppercase">
                Homiq<span className="text-primary font-light">Trends</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-8 items-center">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "text-sm font-sans tracking-wider hover:text-primary transition-colors relative py-2 font-medium",
                      isActive ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavLine"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Icon Controls */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={openSearch}
                className="hover:text-primary hover:bg-transparent"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:text-primary hover:bg-transparent cursor-pointer"
                aria-label="Toggle theme"
              >
                {!mounted ? (
                  <div className="w-5 h-5" />
                ) : theme === "light" ? (
                  <Moon className="w-5 h-5 stroke-[1.5]" />
                ) : (
                  <Sun className="w-5 h-5 stroke-[1.5]" />
                )}
              </Button>

              {/* Wishlist */}
              <Link href={ROUTES.WISHLIST}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary hover:bg-transparent relative"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5 stroke-[1.5]" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground min-w-4 h-4 p-0 flex items-center justify-center text-[9px] font-bold border-background border">
                      {wishlist.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href={ROUTES.CART}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary hover:bg-transparent relative"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground min-w-4 h-4 p-0 flex items-center justify-center text-[9px] font-bold border-background border">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Profile */}
              <Link href={ROUTES.PROFILE} className="hidden sm:inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary hover:bg-transparent"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 stroke-[1.5]" />
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden hover:text-primary hover:bg-transparent cursor-pointer"
                      aria-label="Open Mobile Menu"
                    >
                      <Menu className="w-5 h-5 stroke-[1.5]" />
                    </Button>
                  }
                />
                <SheetContent side="right" className="bg-background border-l border-border/40 w-[300px] sm:w-[400px]">
                  <SheetHeader className="text-left border-b border-border/40 pb-4 mb-6">
                    <SheetTitle className="font-heading tracking-[0.1em] uppercase text-lg text-foreground">
                      Navigation
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4">
                    {NAV_LINKS.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "text-base font-sans tracking-wide hover:text-primary py-2 px-3 rounded-lg transition-all font-medium",
                            isActive
                              ? "text-primary bg-primary/10"
                              : "text-foreground/80 hover:bg-secondary"
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                    <Link
                      href={ROUTES.PROFILE}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-base font-sans tracking-wide hover:text-primary py-2 px-3 rounded-lg transition-all font-medium flex items-center gap-2",
                        pathname === ROUTES.PROFILE
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:bg-secondary"
                      )}
                    >
                      <User className="w-4 h-4" /> Account Profile
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Global Slide-Down Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-50 bg-background/95 backdrop-blur-md shadow-lg border-b border-border/60 py-6 px-4 md:px-8 flex items-center justify-center"
          >
            <div className="max-w-3xl w-full flex items-center gap-4">
              <Search className="w-6 h-6 text-primary stroke-[1.5]" />
              <Input
                type="search"
                placeholder="Search premium products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="bg-transparent border-none text-lg md:text-xl font-light font-sans text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 w-full"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSearch}
                className="hover:text-primary hover:bg-transparent"
                aria-label="Close search"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
