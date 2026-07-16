"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/lib/supabase/client";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState("your email");
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = sessionStorage.getItem("recovery_email");
      if (savedEmail) {
        setTimeout(() => {
          setEmail(savedEmail);
        }, 0);
      }
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle key input and auto focus
  const handleChange = (value: string, idx: number) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[idx] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setTimer(59);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("New 6-digit OTP code dispatched!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = otp.join("");
    if (codeString.length < 6) {
      toast.error("Please enter the full 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    toast.info("Verifying security code...");

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: codeString,
      type: "recovery"
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("OTP verification successful!");
      router.push("/auth/reset-password");
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
              <Link href="/auth/forgot-password" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Link>
              <h2 className="font-heading text-2xl font-semibold text-foreground">Verify OTP</h2>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                We sent a 6-digit passcode to <span className="font-semibold text-foreground">{email}</span>. Enter code to unlock access.
              </p>
            </div>

            {/* OTP Grid Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-2 justify-between">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      if (el) inputRefs.current[idx] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-12 h-14 border border-border bg-secondary/40 text-center text-lg font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground"
                  />
                ))}
              </div>

              {/* Resend and timer */}
              <div className="flex justify-between items-center text-xs">
                {timer > 0 ? (
                  <span className="text-muted-foreground font-light">Resend code in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-accent hover:underline font-semibold cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={`${DESIGN_SYSTEM.radius.button} w-full py-6 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50`}
              >
                {isLoading ? "Verifying..." : "Verify & Continue"} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
