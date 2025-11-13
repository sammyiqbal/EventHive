"use client";

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
  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-primary-950/60 px-8 py-16 shadow-[0_50px_120px_-35px_rgba(99,102,241,0.5)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-10 lg:flex-row lg:items-center"
        >
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
              <Sparkles className="h-4 w-4" /> Igniting experiences
            </span>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Plan, launch, and scale <span className="gradient-text">unforgettable events</span>.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              EventHive pairs human creativity with automation to deliver elevated experiences at every touchpoint—from concept to encore.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild className="px-6 py-3 text-base font-semibold">
                <Link href="/signup">
                  Start crafting
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="px-6 py-3 text-base text-slate-300 hover:text-white">
                <Link href="/dashboard">Explore the dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <div className="glass-panel relative rounded-3xl border border-primary-500/20 bg-gradient-to-br from-slate-900 via-slate-900/70 to-primary-950/30 p-8 shadow-glow">
              <div className="absolute inset-x-16 -top-20 h-32 rounded-full bg-primary-500/30 blur-3xl" />
              <div className="relative space-y-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/80 px-6 py-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
                <div className="rounded-2xl border border-primary-500/30 bg-primary-500/10 px-6 py-5 text-sm text-primary-100">
                  “EventHive helped us craft a multi-city product tour without breaking a sweat. Our team finally gets to focus on the magic.”
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
            <Card className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500/15">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-slate-300">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 px-8 py-14 text-center shadow-glow">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Elevate every moment with EventHive
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
          Designed for teams who obsess over detail. Automations, personalization, and analytics—wrapped in a delightfully simple experience.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild className="px-6 py-3">
            <Link href="/signup">Create your account</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-3">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

