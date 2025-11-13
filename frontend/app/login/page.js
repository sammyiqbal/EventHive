"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { login } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const credentials = { email, password };

    startTransition(async () => {
      try {
        const result = await login(credentials);
        const token = result?.token;

        if (token) {
          const storage = rememberMe ? window.localStorage : window.sessionStorage;
          storage.setItem("eventhive_token", token);
          storage.setItem("eventhive_user", JSON.stringify(result.user));
        }

        router.push("/dashboard");
      } catch (err) {
        setError(err?.message || "Unable to log in. Please try again.");
      }
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl font-semibold text-white md:text-4xl"
        >
          Welcome back
        </motion.h1>
        <p className="mt-3 text-sm text-slate-400">
          No password drama. A few details and you’re back to creating magic.
        </p>
      </div>

      <Card className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@brand.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-slate-700 bg-slate-900/60 text-primary-500 focus:ring-primary-500/60"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>
            <Link href="#" className="text-primary-200 hover:text-primary-100">
              Forgot password?
            </Link>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full py-3 text-base font-semibold" disabled={isPending}>
            {isPending ? "Authenticating..." : "Log in"}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-400">
          New to EventHive?{" "}
          <Link href="/signup" className="text-primary-200 hover:text-primary-100">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}

