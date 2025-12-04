"use client";

import { useAuth } from "../contexts/auth-context";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarHeart, Sparkles, Users, Wand2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const features = [
  {
    title: "Curate effortlessly",
    description:
      "Drag-and-drop builders with intelligent presets cut event planning time in half.",
    icon: <Wand2 className="h-6 w-6 text-primary-300" />
  },
  {
    title: "Delight every guest",
    description:
      "Real-time RSVPs, smart reminders, and contextual messaging keep attendees engaged.",
    icon: <Users className="h-6 w-6 text-primary-300" />
  },
  {
    title: "Unlock insights",
    description:
      "Obsess over what matters with sentiment highlights, revenue forecasts, and heatmaps.",
    icon: <CalendarHeart className="h-6 w-6 text-primary-300" />
  }
];

const stats = [
  { label: "Events orchestrated", value: "12k+" },
  { label: "Attendee satisfaction", value: "98%" },
  { label: "Average time saved", value: "32 hrs" }
];

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
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
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl px-8 py-16 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-10 lg:flex-row lg:items-center"
        >
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              <Sparkles className="h-4 w-4" /> Igniting experiences
            </span>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-2xl">
              Plan, launch, and scale <span className="bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-100 bg-clip-text text-transparent drop-shadow-lg">unforgettable events</span>.
            </h1>
            <p className="max-w-xl text-lg text-white/95 drop-shadow-lg">
              EventHive pairs human creativity with automation to deliver elevated experiences at every touchpoint—from concept to encore.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {user ? (
                <Button asChild variant="outline" className="px-6 py-3 text-base text-white border-white/40 hover:bg-white/10 backdrop-blur-sm">
                  <Link href={user.role === "admin" ? "/dashboard/admin" : "/dashboard"}>Explore the dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="px-6 py-3 text-base font-semibold bg-white text-gray-900 hover:bg-white/90 shadow-xl">
                    <Link href="/signup">
                      Start crafting
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="px-6 py-3 text-base text-white border-white/40 hover:bg-white/10 backdrop-blur-sm">
                    <Link href="/login">Log in</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="relative rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl p-8 shadow-lg">
              <div className="absolute inset-x-16 -top-20 h-32 rounded-full bg-primary-500/20 blur-3xl" />
              <div className="relative space-y-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md px-6 py-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/90">{stat.label}</p>
                    <p className="text-2xl font-semibold text-white drop-shadow-md">{stat.value}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md px-6 py-5 text-sm text-white/95">
                  "EventHive helped us craft a multi-city product tour without breaking a sweat. Our team finally gets to focus on the magic."
                  <p className="mt-3 text-xs uppercase tracking-[0.3em] text-primary-200/70">— Nova Collective</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <Card className="space-y-4 backdrop-blur-xl bg-white/5 border-white/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/20 backdrop-blur-sm">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white drop-shadow-lg">{feature.title}</h3>
              <p className="text-sm text-white/90 drop-shadow-md">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl px-8 py-14 text-center shadow-lg">
        <h2 className="text-3xl font-semibold text-white md:text-4xl drop-shadow-2xl">
          Elevate every moment with EventHive
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/95 drop-shadow-lg">
          Designed for teams who obsess over detail. Automations, personalization, and analytics—wrapped in a delightfully simple experience.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {user ? (
            <Button asChild className="px-6 py-3 bg-white text-gray-900 hover:bg-white/90 shadow-xl">
              <Link href={user.role === "admin" ? "/dashboard/admin" : "/dashboard"}>Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild className="px-6 py-3 bg-white text-gray-900 hover:bg-white/90 shadow-xl">
                <Link href="/signup">Create your account</Link>
              </Button>
              <Button asChild variant="outline" className="px-6 py-3 text-white border-white/40 hover:bg-white/10 backdrop-blur-sm">
                <Link href="/login">Log in</Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

