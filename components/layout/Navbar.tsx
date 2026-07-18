"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag, User, Heart, Sun, Moon, ArrowRight, Trash2, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/providers/ThemeProvider";
import { NAV_LINKS } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { CATEGORIES } from "@/constants/categories";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import AnnouncementBar from "@/features/home/AnnouncementBar/AnnouncementBar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollDirection, isAtTop } = useScrollDirection();
  const { cartCount, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme, mounted } = useTheme();
  const { isOpen: searchOpen, openSearch, closeSearch, query, setQuery } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isHidden = scrollDirection === "down" && !isAtTop;

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full flex flex-col",
          isHidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        {/* Top-aligned Announcement Bar (36px height) */}
        <AnnouncementBar />

        {/* Header Block (80px height always) */}
        <header
          className={cn(
            "transition-all duration-300 w-full relative border-b backdrop-blur-md h-[80px] flex items-center justify-between",
            isAtTop
              ? "bg-white/20 dark:bg-[#181816]/20 border-border/20 shadow-[0_2px_15px_-5px_rgba(217,183,154,0.06)]"
              : "bg-white/95 dark:bg-[#181816]/95 border-border shadow-[0_4px_20px_-5px_rgba(217,183,154,0.12)]"
          )}
        >
          <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-8 lg:px-10 h-full flex items-center justify-between">
            {/* Logo */}
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <span className="font-heading text-2xl font-semibold tracking-[0.28em] text-foreground uppercase transition-all duration-300">
                Homiq<span className="text-primary font-light">Trends</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-12 items-center h-full">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const isCategories = link.label === "Categories";

                return (
                  <div
                    key={link.label}
                    onMouseEnter={isCategories ? () => setMegaMenuOpen(true) : undefined}
                    onMouseLeave={isCategories ? () => setMegaMenuOpen(false) : undefined}
                    className="relative py-2 h-full flex items-center"
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "text-xs font-sans uppercase tracking-[0.2em] transition-all duration-200 font-medium cursor-pointer relative py-1",
                        isActive 
                          ? "text-primary" 
                          : "text-foreground/80 hover:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavLine"
                        className="absolute bottom-4 left-0 right-0 h-[1.5px] bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Icon Controls */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={openSearch}
                className="hover:text-accent hover:bg-transparent cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5 stroke-[1.5]" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:text-accent hover:bg-transparent cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Toggle theme"
              >
                {!mounted ? (
                  <div className="w-4.5 h-4.5" />
                ) : theme === "light" ? (
                  <Moon className="w-4.5 h-4.5 stroke-[1.5]" />
                ) : (
                  <Sun className="w-4.5 h-4.5 stroke-[1.5]" />
                )}
              </Button>

              {/* Wishlist */}
              <Link href={ROUTES.WISHLIST}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-accent hover:bg-transparent relative cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label="Wishlist"
                >
                  <Heart className="w-4.5 h-4.5 stroke-[1.5]" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground min-w-4 h-4 p-0 flex items-center justify-center text-[9px] font-bold border-background border rounded-full">
                      {wishlist.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart Drawer */}
              <Sheet open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-accent hover:bg-transparent relative cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                      aria-label="Cart"
                    >
                      <ShoppingBag className="w-4.5 h-4.5 stroke-[1.5]" />
                      {cartCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground min-w-4 h-4 p-0 flex items-center justify-center text-[9px] font-bold border-background border rounded-full">
                          {cartCount}
                        </Badge>
                      )}
                    </Button>
                  }
                />
                <SheetContent side="right" className="bg-white dark:bg-[#222220] border-l border-border w-[320px] sm:w-[420px] rounded-l-3xl shadow-2xl flex flex-col justify-between p-6">
                  <div className="flex-1 flex flex-col min-h-0">
                    <SheetHeader className="text-left border-b border-border pb-4 mb-4">
                      <SheetTitle className="font-heading tracking-[0.15em] uppercase text-lg text-foreground flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" /> Shopping Bag ({cartCount})
                      </SheetTitle>
                    </SheetHeader>

                    {cartItems.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground stroke-[1]" />
                        <h4 className="font-heading text-base font-semibold text-foreground">Your bag is empty</h4>
                        <p className="text-xs text-muted-foreground max-w-[220px]">Explore our catalog to find premium home essentials.</p>
                        <Link href="/products" onClick={() => setCartDrawerOpen(false)}>
                          <Button className="bg-primary text-primary-foreground py-4 px-6 text-xs uppercase tracking-wider font-bold rounded-xl mt-2 cursor-pointer">
                            Shop Collections
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-3 py-3 border-b border-border/50 last:border-b-0 justify-between items-start">
                            <div className="w-14 h-16 relative bg-secondary rounded-lg overflow-hidden shrink-0 border border-border">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-sans font-medium text-xs text-foreground truncate">{item.name}</h5>
                              <span className="text-[10px] text-accent font-semibold block mt-0.5">Rs. {item.price}</span>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className="w-5 h-5 rounded-md border border-border flex items-center justify-center text-xs hover:bg-secondary cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-5 h-5 rounded-md border border-border flex items-center justify-center text-xs hover:bg-secondary cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                removeFromCart(item.id);
                                toast.info(`${item.name} removed from bag.`);
                              }}
                              className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="border-t border-border pt-4 space-y-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-muted-foreground">Estimated Subtotal</span>
                        <span className="text-lg font-bold text-foreground">Rs. {cartTotal}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link href="/cart" onClick={() => setCartDrawerOpen(false)} className="w-full">
                          <Button variant="outline" className="w-full py-5 text-[10px] font-bold tracking-wider uppercase border-border hover:bg-secondary cursor-pointer rounded-xl">
                            View Bag
                          </Button>
                        </Link>
                        <Link href="/checkout" onClick={() => setCartDrawerOpen(false)} className="w-full">
                          <Button className="w-full py-5 text-[10px] font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer rounded-xl shadow-xs">
                            Checkout
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              {/* Profile */}
              <Link href={ROUTES.PROFILE} className="hidden sm:inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-accent hover:bg-transparent cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label="Account"
                >
                  <User className="w-4.5 h-4.5 stroke-[1.5]" />
                </Button>
              </Link>

              {/* Admin Link */}
              {user?.user_metadata?.role === "admin" && (
                <Link href="/admin" className="hidden sm:inline-flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-accent hover:bg-transparent cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                    aria-label="Admin Dashboard"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-4.5 h-4.5 stroke-[1.5]" />
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden hover:text-accent hover:bg-transparent cursor-pointer transition-all duration-200"
                      aria-label="Open Mobile Menu"
                    >
                      <Menu className="w-5 h-5 stroke-[1.5]" />
                    </Button>
                  }
                />
                <SheetContent side="right" className="bg-white dark:bg-[#222220] border-l border-border w-[300px] sm:w-[400px] rounded-l-3xl shadow-2xl">
                  <SheetHeader className="text-left border-b border-border pb-4 mb-6">
                    <SheetTitle className="font-heading tracking-[0.15em] uppercase text-lg text-foreground">
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
                            "text-sm font-sans uppercase tracking-[0.15em] hover:text-primary py-2.5 px-3 rounded-xl transition-all font-medium",
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
                        "text-sm font-sans uppercase tracking-[0.15em] hover:text-primary py-2.5 px-3 rounded-xl transition-all font-medium flex items-center gap-2",
                        pathname === ROUTES.PROFILE
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:bg-secondary"
                      )}
                    >
                      <User className="w-4 h-4" /> Account Profile
                    </Link>

                    {/* Admin Dashboard Mobile Shortcut */}
                    {user?.user_metadata?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "text-sm font-sans uppercase tracking-[0.15em] hover:text-primary py-2.5 px-3 rounded-xl transition-all font-semibold flex items-center gap-2 text-primary bg-primary/5",
                          pathname === "/admin" && "bg-primary/15"
                        )}
                      >
                        <Shield className="w-4 h-4" /> Admin Console
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Categories Mega Menu */}
          <AnimatePresence>
            {megaMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
                className="absolute left-0 right-0 top-full bg-white dark:bg-[#222220] border-b border-border shadow-md z-30"
              >
                <div className="max-w-[1400px] mx-auto px-8 py-10 grid grid-cols-4 gap-8">
                  {/* Category Columns */}
                  <div className="col-span-3 grid grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-4">Featured Collections</h4>
                      <ul className="space-y-3.5 text-xs">
                        {CATEGORIES.slice(0, 3).map((cat) => (
                          <li key={cat.id}>
                            <Link
                              href={`/categories/${cat.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="text-foreground/75 hover:text-primary transition-colors flex items-center justify-between"
                            >
                              <span>{cat.name}</span>
                              <span className="text-[10px] text-muted-foreground">{cat.productCount} items</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-4">Other Catalog Categories</h4>
                      <ul className="space-y-3.5 text-xs">
                        {CATEGORIES.slice(3).map((cat) => (
                          <li key={cat.id}>
                            <Link
                              href={`/categories/${cat.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="text-foreground/75 hover:text-primary transition-colors flex items-center justify-between"
                            >
                              <span>{cat.name}</span>
                              <span className="text-[10px] text-muted-foreground">{cat.productCount} items</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-4">Shop By Filters</h4>
                      <ul className="space-y-3.5 text-xs">
                        <li>
                          <Link href={`${ROUTES.PRODUCTS}?filter=new`} onClick={() => setMegaMenuOpen(false)} className="text-foreground/75 hover:text-primary transition-colors">
                            New Arrivals
                          </Link>
                        </li>
                        <li>
                          <Link href={`${ROUTES.PRODUCTS}?filter=best`} onClick={() => setMegaMenuOpen(false)} className="text-foreground/75 hover:text-primary transition-colors">
                            Best Sellers
                          </Link>
                        </li>
                        <li>
                          <Link href={`${ROUTES.PRODUCTS}?filter=sale`} onClick={() => setMegaMenuOpen(false)} className="text-foreground/75 hover:text-primary transition-colors">
                            Special Clearance Sale
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Mega Menu Promo Card */}
                  <div className="col-span-1 rounded-xl bg-[#F8F5F2] dark:bg-[#1C1C1A] border border-border p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider bg-[#EEDCCB] dark:bg-primary/20 text-accent px-1.5 py-0.5 rounded font-semibold">Promotion</span>
                      <h5 className="font-heading text-sm font-semibold tracking-wide text-foreground mt-3">Summer Living Room Sale</h5>
                      <p className="text-xs text-muted-foreground mt-1 font-light leading-relaxed">Get up to 40% off handcrafted brass lights & travertine trays.</p>
                    </div>
                    <Link
                      href={`${ROUTES.PRODUCTS}?category=decor`}
                      onClick={() => setMegaMenuOpen(false)}
                      className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors flex items-center gap-1 mt-4"
                    >
                      Shop Summer Sale <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>

      {/* Global Slide-Down Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-50 bg-white/95 dark:bg-[#181816]/95 backdrop-blur-md shadow-md border-b border-border py-6 px-4 md:px-8 flex items-center justify-center"
          >
            <div className="max-w-3xl w-full flex items-center gap-4">
              <Search className="w-5 h-5 text-primary stroke-[1.5]" />
              <Input
                type="search"
                placeholder="Search premium products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    closeSearch();
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                  }
                }}
                autoFocus
                className="bg-transparent border-none text-lg font-light font-sans text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 w-full"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSearch}
                className="hover:text-primary hover:bg-transparent cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
