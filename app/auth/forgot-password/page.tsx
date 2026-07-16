"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { toast } from "sonner";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    toast.info("Sending recovery code...");

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Recovery code / link dispatched to your inbox!");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("recovery_email", email);
      }
      router.push("/auth/verify-otp");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <Container className="max-w-md">
          <div className="bg-white dark:bg-[#222220] border border-border p-8 rounded-3xl shadow-xs space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
              <h2 className="font-heading text-2xl font-semibold text-foreground">Recover Password</h2>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Enter your account email. We will send you a 6-digit OTP verification code to reset credentials.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Email Address</span>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
                  <Input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 bg-secondary/40 border-border rounded-xl text-xs py-5.5 focus-visible:ring-primary w-full"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={`${DESIGN_SYSTEM.radius.button} w-full py-6 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50`}
              >
                {isLoading ? "Sending code..." : "Send Verification Code"} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
