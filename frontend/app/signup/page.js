"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { signup, initiateOAuth } from "../../lib/api";
import { useAuth } from "../../contexts/auth-context";
import { Github } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading, login: authLogin } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload = {
      email,
      password,
      name: [firstName, lastName].filter(Boolean).join(" ").trim() || undefined,
      role: role || "student"
    };

    startTransition(async () => {
      try {
        const result = await signup(payload);
        const token = result?.token;

        if (token) {
          authLogin(token, result.user, true);
          // Redirect based on role
          if (result.user.role === "admin") {
            router.push("/dashboard/admin");
          } else {
            router.push("/dashboard");
          }
        }
      } catch (err) {
        setError(err?.message || "Unable to create your account. Please try again.");
      }
    });
  };

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl font-semibold text-white md:text-4xl"
        >
          Craft your EventHive account
        </motion.h1>
        <p className="mt-3 text-sm text-slate-400">
          Set the foundation for experiences that captivate and convert.
        </p>
      </div>

      <Card className="space-y-6">
        {/* OAuth Buttons */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full py-3 text-base font-semibold border-white/40 hover:bg-white/10 backdrop-blur-sm"
            onClick={() => initiateOAuth("google")}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full py-3 text-base font-semibold border-white/40 hover:bg-white/10 backdrop-blur-sm"
            onClick={() => initiateOAuth("github")}
          >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-primary-500/20 backdrop-blur-sm border border-primary-500/30 rounded-full px-4 py-1.5 text-primary-200 font-medium">Or continue with email</span>
          </div>
        </div>

        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="Avery"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Miya"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              placeholder="experience@brand.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="role">I am a</Label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              style={{
                background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.2) 0%, rgba(162, 155, 254, 0.15) 100%)',
                borderColor: 'rgba(108, 92, 231, 0.5)'
              }}
              className="w-full rounded-lg border px-4 py-3 text-sm text-white outline-none transition-all hover:bg-gradient-to-r hover:from-[#6C5CE7]/30 hover:to-[#A29BFE]/25 focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/30 backdrop-blur-sm"
            >
              <option value="student" style={{ background: '#1B1B1B', color: '#FFFFFF' }}>Student</option>
              <option value="admin" style={{ background: '#1B1B1B', color: '#FFFFFF' }}>Club Admin</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-1">
            {/* Empty div to maintain grid alignment */}
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {error ? (
            <div className="md:col-span-2">
              <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            </div>
          ) : null}

          <div className="md:col-span-2">
            <Button type="submit" className="w-full py-3 text-base font-semibold" disabled={isPending}>
              {isPending ? "Creating your account..." : "Launch EventHive"}
            </Button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-400">
          By creating an account you agree to the{" "}
          <Link href="#" className="text-primary-200 hover:text-primary-100">
            terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary-200 hover:text-primary-100">
            privacy policy
          </Link>
          .
        </p>

        <div className="text-center text-sm text-slate-400">
          Already using EventHive?{" "}
          <Link href="/login" className="text-primary-200 hover:text-primary-100">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
}

