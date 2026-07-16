"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DESIGN_SYSTEM } from "@/constants/theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, CreditCard, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    notes: ""
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  // Coupon & Shipping calculations from sessionStorage (fallback to standard defaults)
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const discount = Number(sessionStorage.getItem("checkout_discount") || "0");
      const shipping = Number(sessionStorage.getItem("checkout_shipping") || "0");
      const coupon = sessionStorage.getItem("checkout_coupon_code") || "";
      setTimeout(() => {
        setDiscountAmount(discount);
        setShippingCost(shipping);
        setCouponCode(coupon);
      }, 0);
    }
  }, []);

  // Mock decline checkbox to test Checkout failure
  const [shouldDecline, setShouldDecline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
          if (data) {
            setFormData(prev => ({
              ...prev,
              firstName: data.full_name?.split(" ")[0] || "",
              lastName: data.full_name?.split(" ").slice(1).join(" ") || "",
              email: user.email || "",
              phone: data.phone || ""
            }));
          }
        });
      }
    });
  }, []);

  const estimatedTotal = cartTotal - discountAmount + shippingCost;

  // Protect empty checkout routing
  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      toast.error("Your shopping bag is empty.");
      router.push("/cart");
    }
  }, [cartItems, router, isSubmitting]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode ||
      !formData.phone
    ) {
      toast.error("Please fill in all shipping fields.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
        toast.error("Please fill in card details.");
        return;
      }
    }

    if (!user) {
      toast.error("Please sign in or create an account to place an order.");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    toast.info("Authorizing transaction...");

    try {
      const supabase = createClient();

      if (shouldDecline) {
        setIsSubmitting(false);
        router.push("/checkout/failed");
        return;
      }

      // 1. Store shipping address
      const { data: addrData, error: addrError } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          full_name: `${formData.firstName} ${formData.lastName}`,
          address_line1: formData.address,
          city: formData.city,
          state: formData.city, // fallback state to city string
          postal_code: formData.zipCode,
          country: "United States",
          phone: formData.phone
        })
        .select()
        .single();

      if (addrError) throw addrError;

      // 2. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "placed",
          total: estimatedTotal,
          tax: 0.00,
          shipping: shippingCost,
          discount: discountAmount,
          address_id: addrData.id
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Insert order items and update product inventory stock
      for (const item of cartItems) {
        const { error: itemError } = await supabase
          .from("order_items")
          .insert({
            order_id: orderData.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price
          });

        if (itemError) throw itemError;

        // Decrement product inventory stock
        const { data: prodData } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.productId)
          .single();

        if (prodData) {
          const newStock = Math.max(0, prodData.stock - item.quantity);
          await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", item.productId);
        }
      }

      // 4. Save Coupon Usage if coupon exists
      if (couponCode) {
        const { data: couponData } = await supabase
          .from("coupons")
          .select("id")
          .eq("code", couponCode.toUpperCase())
          .single();

        if (couponData) {
          await supabase
            .from("coupon_usage")
            .insert({
              coupon_id: couponData.id,
              user_id: user.id,
              order_id: orderData.id
            });
        }
      }

      // Successful order placement
      const orderId = orderData.id;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("last_order_id", orderId);
        sessionStorage.setItem("last_order_total", estimatedTotal.toString());
        sessionStorage.setItem("last_order_address", `${formData.address}, ${formData.city}`);
        sessionStorage.setItem("last_order_items", JSON.stringify(cartItems));
      }
      
      await clearCart();
      setIsSubmitting(false);
      router.push("/checkout/success");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred during order submission.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container>
          <div className="space-y-12">
            <SectionHeading
              title="Secure Checkout"
              subtitle="Bespoke Order"
              description="Complete billing and shipping details to authorize secure transactions."
            />

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Shipping & Payment forms */}
              <div className="lg:col-span-8 space-y-8">
                {/* Shipping Details */}
                <div className="bg-white dark:bg-[#222220] border border-border p-6 sm:p-8 rounded-3xl space-y-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground">1. Shipping Address</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">First Name</span>
                      <Input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Last Name</span>
                      <Input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Email Address</span>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Phone Number</span>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Street Address</span>
                    <Input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">City</span>
                      <Input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">ZIP / Postal Code</span>
                      <Input
                        type="text"
                        required
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Order Notes (Optional)</span>
                    <Textarea
                      placeholder="e.g. Courier instructions"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-secondary/40 border-border rounded-xl text-xs py-4 min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Payment Options */}
                <div className="bg-white dark:bg-[#222220] border border-border p-6 sm:p-8 rounded-3xl space-y-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground">2. Payment Method</h3>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-4 border rounded-xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" /> Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`flex-1 py-4 border rounded-xl flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                        paymentMethod === "paypal"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      PayPal Express
                    </button>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Cardholder Name</span>
                        <Input
                          type="text"
                          required={paymentMethod === "card"}
                          placeholder="John Doe"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Card Number</span>
                        <Input
                          type="text"
                          required={paymentMethod === "card"}
                          placeholder="4111 2222 3333 4444"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Expiry Date</span>
                          <Input
                            type="text"
                            required={paymentMethod === "card"}
                            placeholder="MM/YY"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Security CVV</span>
                          <Input
                            type="password"
                            required={paymentMethod === "card"}
                            placeholder="123"
                            maxLength={3}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#F8F5F2] dark:bg-[#1C1C1A] p-6 rounded-2xl text-center space-y-2 border border-border">
                      <span className="text-xs text-muted-foreground font-light">
                        PayPal authorization panel will trigger overlay checkout upon clicking &quot;Place Order&quot;.
                      </span>
                    </div>
                  )}

                  {/* Decline checkbox to check Failed order route */}
                  <label className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={shouldDecline}
                      onChange={(e) => setShouldDecline(e.target.checked)}
                      className="accent-destructive"
                    />
                    <span className="text-destructive font-semibold">Simulate Transaction Decline (Test failure flow)</span>
                  </label>
                </div>
              </div>

              {/* Right Column: Order Summary & Placement */}
              <div className="lg:col-span-4 bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                <h3 className="font-heading text-lg font-semibold text-foreground">Order Summary</h3>

                {/* Items Mini List */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 border-b border-border pb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 justify-between items-center text-xs">
                      <div className="w-10 h-12 relative bg-[#F8F5F2] rounded-lg overflow-hidden border border-border shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 truncate pr-2">
                        <h4 className="font-sans font-medium text-foreground truncate">{item.name}</h4>
                        <span className="text-[10px] text-muted-foreground font-light">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-semibold text-foreground">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items Subtotal</span>
                    <span className="font-semibold">${cartTotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Promo Discount ({couponCode})</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Courier</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-500">
                      {shippingCost === 0 ? "Free" : `$${shippingCost}`}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3.5 flex justify-between items-baseline">
                    <span className="font-semibold text-sm">Amount Due</span>
                    <span className="text-xl font-bold text-foreground">${estimatedTotal}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${DESIGN_SYSTEM.radius.button} w-full py-6 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase cursor-pointer shadow-xs disabled:opacity-50`}
                >
                  {isSubmitting ? "Processing..." : "Place Secure Order"} <ArrowRight className="w-4 h-4" />
                </Button>

                <div className="flex gap-2 items-center justify-center text-[10px] text-muted-foreground/80 font-light border-t border-border pt-4">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 stroke-[1.5]" /> Secure 256-bit SSL transaction authorization.
                </div>

                <div className="text-center pt-2">
                  <Link
                    href="/cart"
                    className="text-xs text-accent hover:text-accent/80 transition-colors font-medium font-sans inline-flex items-center gap-1"
                  >
                    &larr; Back to Cart
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
