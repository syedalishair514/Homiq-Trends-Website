"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all details.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    toast.info("Updating password...");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Password successfully reset! Please sign in.");
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("recovery_email");
      }
      router.push("/login");
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
              <h2 className="font-heading text-2xl font-semibold text-foreground">Reset Password</h2>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Set a secure new password for your Homiq Trends digital account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">New Password</span>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 bg-secondary/40 border-border rounded-xl text-xs py-5.5 focus-visible:ring-primary w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Confirm New Password</span>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
                  <Input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 bg-secondary/40 border-border rounded-xl text-xs py-5.5 focus-visible:ring-primary w-full"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className={`${DESIGN_SYSTEM.radius.button} w-full py-6 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50`}
              >
                {isLoading ? "Saving..." : "Reset Password"} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
