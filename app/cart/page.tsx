"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import EmptyState from "@/components/shared/EmptyState";
import ProductCard from "@/components/shared/ProductCard";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/constants/products";
import { ShoppingBag, Trash2, ArrowRight, Check, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartShippingTotal } = useCart();

  // Coupon & Shipping States
  const [couponInput, setCouponInput] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "priority">("standard");
  const [zipCode, setZipCode] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  // Apply Coupon code
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    // Direct mock coupon
    if (couponInput.trim().toUpperCase() === "HOMIQ15") {
      setCouponDiscount(15);
      setActiveCoupon("HOMIQ15");
      toast.success("Promo discount HOMIQ15 code applied!");
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponInput.toUpperCase())
      .eq("status", "active")
      .single();

    if (error || !data) {
      toast.error("Invalid or inactive coupon code.");
    } else {
      setCouponDiscount(data.discount_percent);
      setActiveCoupon(data.code);
      toast.success(`Promo code ${data.code} applied! Saved ${data.discount_percent}%`);
    }
  };

  // Remove Coupon code
  const handleRemoveCoupon = () => {
    setCouponDiscount(0);
    setActiveCoupon(null);
    setCouponInput("");
    toast.info("Coupon discount code removed.");
  };

  // Calculate Shipping rates
  const handleShippingEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) {
      toast.error("Please enter a destination ZIP Code.");
      return;
    }
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      toast.success(`Shipping rates calculated successfully for ZIP ${zipCode}!`);
    }, 800);
  };

  // Calculations
  const discountAmount = useMemo(() => {
    return Math.round(cartTotal * (couponDiscount / 100));
  }, [cartTotal, couponDiscount]);

  const shippingCost = cartTotal >= 15000 && shippingMethod === "standard"
    ? 0
    : cartShippingTotal + (shippingMethod === "priority" ? 1500 : 0);
  const estimatedTotal = cartTotal - discountAmount + shippingCost;

  // Recommendations: Filter products currently in cart, show 4 featured items
  const recommendations = useMemo(() => {
    const cartProductIds = cartItems.map((item) => item.productId);
    return PRODUCTS.filter((p) => !cartProductIds.includes(p.id)).slice(0, 4);
  }, [cartItems]);

  const handleCheckout = () => {
    // Save coupon and shipping state in sessionStorage or state before routing if needed
    if (typeof window !== "undefined") {
      sessionStorage.setItem("checkout_discount", discountAmount.toString());
      sessionStorage.setItem("checkout_shipping", shippingCost.toString());
      sessionStorage.setItem("checkout_coupon_code", activeCoupon || "");
    }
    router.push("/checkout");
  };

  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] space-y-16">
        <Container>
          <div className="space-y-12">
            <SectionHeading
              title="Shopping Cart"
              subtitle="My Bag"
              description="Review selected items, adjust quantities, and secure your order."
            />

            {cartItems.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  title="Your shopping bag is empty"
                  description="Find beautifully crafted items in our boutique catalogue to start shopping."
                  icon={ShoppingBag}
                  ctaText="Shop New Arrivals"
                  ctaLink="/products?filter=new"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Cart Items & Calculations */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Cart Items List */}
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    {cartItems.map((item) => {
                      const originalProduct = PRODUCTS.find((p) => p.id === item.productId);
                      const category = originalProduct ? originalProduct.category : "Decor";
                      const maxStock = originalProduct ? originalProduct.stock : 99;

                      return (
                        <div
                          key={item.id}
                          className="flex gap-4 sm:gap-6 py-5 first:pt-0 last:pb-0 border-b border-border/60 last:border-b-0 items-center justify-between"
                        >
                          {/* Left: Image & Name */}
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-20 relative bg-[#F8F5F2] dark:bg-[#1C1C1A] rounded-xl overflow-hidden border border-border shrink-0">
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <h4 className="font-sans font-medium text-sm text-foreground">
                                {item.name}
                              </h4>
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mt-0.5">
                                {category}
                              </span>
                              <span className="text-xs font-semibold text-accent mt-1.5 block">
                                Rs. {item.price}
                              </span>
                            </div>
                          </div>

                          {/* Right: Quantity & Delete */}
                          <div className="flex items-center gap-4 sm:gap-8">
                            <div className="flex items-center border border-border rounded-xl h-10 bg-[#F8F5F2] dark:bg-[#1C1C1A]">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-8 text-center text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, Math.min(maxStock, item.quantity + 1))}
                                className="w-8 text-center text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                removeFromCart(item.id);
                                toast.info(`${item.name} removed from bag.`);
                              }}
                              className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4.5 h-4.5 stroke-[1.5]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coupon & Shipping Estimation block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coupon Box */}
                    <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-4">
                      <h4 className="font-sans font-semibold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-primary" /> Promo Discount Coupon
                      </h4>
                      {activeCoupon ? (
                        <div className="bg-[#F8F5F2] dark:bg-[#1C1C1A] border border-primary/20 p-4 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-foreground">Code {activeCoupon} Applied</span>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-xs text-destructive hover:underline cursor-pointer font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter Code (e.g. HOMIQ15)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="bg-secondary/40 border-border rounded-xl text-xs flex-1 py-5 focus-visible:ring-primary"
                          />
                          <Button
                            type="submit"
                            className={`${DESIGN_SYSTEM.radius.button} bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-wider px-5 cursor-pointer`}
                          >
                            Apply
                          </Button>
                        </form>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        Use coupon code <span className="font-semibold text-accent">HOMIQ15</span> to save 15% on your total order.
                      </p>
                    </div>

                    {/* Shipping Estimate Box */}
                    <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-4">
                      <h4 className="font-sans font-semibold text-xs uppercase tracking-wider text-foreground">
                        Shipping Estimator
                      </h4>
                      <form onSubmit={handleShippingEstimate} className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Enter ZIP Code"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="bg-secondary/40 border-border rounded-xl text-xs flex-1 py-5 focus-visible:ring-primary"
                        />
                        <Button
                          type="submit"
                          disabled={isCalculating}
                          className={`${DESIGN_SYSTEM.radius.button} bg-transparent border border-border text-foreground hover:bg-secondary text-xs font-bold uppercase tracking-wider px-5 cursor-pointer`}
                        >
                          {isCalculating ? "Calculating..." : "Estimate"}
                        </Button>
                      </form>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-xs text-foreground/80 cursor-pointer">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === "standard"}
                            onChange={() => setShippingMethod("standard")}
                            className="accent-primary"
                          />
                          <span>Standard Courier Delivery (Free, 3-5 days)</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-foreground/80 cursor-pointer">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === "priority"}
                            onChange={() => setShippingMethod("priority")}
                            className="accent-primary"
                          />
                           <span>Priority Dispatch Delivery (Rs. 1,500, 1-2 days)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-4 bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground">Order Summary</h3>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bag Subtotal</span>
                      <span className="font-semibold">Rs. {cartTotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>Coupon Discount (15%)</span>
                        <span>-Rs. {discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Courier Delivery</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-500">
                        {shippingCost === 0 ? "Free" : `Rs. ${shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes & Duties</span>
                      <span className="text-muted-foreground italic font-light text-xs">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 flex justify-between items-baseline">
                    <span className="font-semibold text-sm">Estimated Total</span>
                    <span className="text-xl font-bold text-foreground font-sans">Rs. {estimatedTotal}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className={`${DESIGN_SYSTEM.radius.button} w-full py-6 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase cursor-pointer shadow-xs`}
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="text-center pt-2">
                    <Link
                      href="/products"
                      className="text-xs text-accent hover:text-accent/80 transition-colors font-medium font-sans inline-flex items-center gap-1"
                    >
                      &larr; Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>

        {/* Curation Recommendations section */}
        {recommendations.length > 0 && (
          <Container>
            <div className="space-y-8 border-t border-border pt-12">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Add to your space</span>
                <h3 className="font-heading text-xl font-semibold text-foreground mt-1">Recommended for You</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommendations.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </Container>
        )}
      </main>
      <Footer />
    </>
  );
}


