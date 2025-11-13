"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { signup } from "../../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

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
      organization: organization || undefined
    };

    startTransition(async () => {
      try {
        const result = await signup(payload);
        const token = result?.token;

        if (token) {
          window.localStorage.setItem("eventhive_token", token);
          window.localStorage.setItem("eventhive_user", JSON.stringify(result.user));
        }

        router.push("/dashboard");
      } catch (err) {
        setError(err?.message || "Unable to create your account. Please try again.");
      }
    });
  };

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
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="company">Organization</Label>
            <Input
              id="company"
              placeholder="Nova Collective"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
            />
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

