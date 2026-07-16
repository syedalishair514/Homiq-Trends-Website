"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
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
    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    toast.info("Registering account...");

    const supabase = createClient();
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      toast.success("Account successfully created!");
      // Redirect based on whether email confirmation is required or auto-login
      if (data.session) {
        router.push("/profile");
      } else {
        toast.info("Please verify your email inbox to activate account.");
        router.push("/login");
      }
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
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </Link>
              <h2 className="font-heading text-2xl font-semibold text-foreground">Create Account</h2>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Join Homiq Trends for curated lifestyle designs and priority tracking.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Full Name</span>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
                  <Input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 bg-secondary/40 border-border rounded-xl text-xs py-5.5 focus-visible:ring-primary w-full"
                  />
                </div>
              </div>

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

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Password</span>
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
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Confirm Password</span>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
                  <Input
                    type="password"
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 bg-secondary/40 border-border rounded-xl text-xs py-5.5 focus-visible:ring-primary w-full"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="accent-primary mt-0.5 shrink-0"
                />
                <span>
                  I agree to the Homiq Trends <span className="text-accent hover:underline font-semibold">Terms of Service</span> and <span className="text-accent hover:underline font-semibold">Privacy Policy</span>.
                </span>
              </label>

              <Button
                type="submit"
                disabled={isLoading}
                className={`${DESIGN_SYSTEM.radius.button} w-full py-6 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50`}
              >
                {isLoading ? "Creating account..." : "Sign Up"} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="text-center border-t border-border pt-4 text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
