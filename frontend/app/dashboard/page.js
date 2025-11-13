"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3, CalendarDays, Clock, Megaphone, ServerCog, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { getHealth } from "../../lib/api";

const metrics = [
  {
    label: "Active events",
    value: "7",
    trend: "+2 this week",
    icon: <CalendarDays className="h-5 w-5 text-primary-300" />
  },
  {
    label: "Guest confirmations",
    value: "1,248",
    trend: "+14.5%",
    icon: <Users className="h-5 w-5 text-primary-300" />
  },
  {
    label: "Time saved",
    value: "86 hrs",
    trend: "Automation impact",
    icon: <Clock className="h-5 w-5 text-primary-300" />
  }
];

const timeline = [
  {
    title: "Investor Summit NYC",
    date: "Mar 18",
    detail: "Speaker run-through & AV sync",
    status: "In progress"
  },
  {
    title: "Creator Lab 2.0",
    date: "Mar 22",
    detail: "Finalize brand partnerships",
    status: "Action needed"
  },
  {
    title: "Product Debut Berlin",
    date: "Apr 03",
    detail: "Guest experience journey mapping",
    status: "On track"
  }
];

export default function DashboardPage() {
  const [health, setHealth] = useState({ status: "checking...", database: null });
  const [healthError, setHealthError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getHealth()
      .then((data) => {
        if (!isMounted) return;
        setHealth({
          status: data?.status || "unknown",
          database: data?.database || "unknown"
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        setHealthError(err?.message || "Unable to reach API");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Pulse on every experience. Automations humming, guests delighted, teams in sync.
          </p>
        </div>
        <Button className="w-full gap-2 px-5 py-3 text-sm font-semibold lg:w-auto">
          Create event
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.45 }}
            viewport={{ once: true }}
          >
            <Card className="space-y-5">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{metric.label}</span>
                {metric.icon}
              </div>
              <p className="text-3xl font-semibold text-white">{metric.value}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-primary-200/70">{metric.trend}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Engagement trajectory</h2>
            <Button variant="ghost" className="gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
              View report
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/80 p-6">
            <div className="h-56 w-full rounded-2xl bg-gradient-to-tr from-primary-500/20 via-primary-400/10 to-primary-300/20">
              <div className="flex h-full items-end justify-between px-4 pb-4">
                {[40, 62, 48, 78, 92, 86, 104].map((height, idx) => (
                  <div
                    key={idx}
                    className="w-10 rounded-t-full bg-gradient-to-t from-primary-600 to-primary-300"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Momentum alerts</h2>
            <Button variant="ghost" className="gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
              Automations
              <Megaphone className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-5 text-sm text-slate-300">
            {timeline.map((item) => (
              <li key={item.title} className="rounded-2xl border border-slate-800/70 bg-slate-900/80 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <span className="text-xs uppercase tracking-[0.3em] text-primary-200/80">{item.status}</span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">{item.date}</p>
                <p className="mt-3 text-sm text-slate-300">{item.detail}</p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/15">
              <ServerCog className="h-5 w-5 text-primary-300" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">API connectivity</h3>
              {healthError ? (
                <p className="text-sm text-red-300">{healthError}</p>
              ) : (
                <p className="text-sm text-slate-300">
                  Status: <span className="text-primary-200">{health.status}</span> · Database:{" "}
                  <span className="text-primary-200">{health.database || "verifying..."}</span>
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-xs uppercase tracking-[0.25em] text-slate-400"
            onClick={() => {
              setHealthError("");
              setHealth({ status: "checking...", database: null });
              getHealth()
                .then((data) => {
                  setHealth({
                    status: data?.status || "unknown",
                    database: data?.database || "unknown"
                  });
                })
                .catch((err) => {
                  setHealthError(err?.message || "Unable to reach API");
                });
            }}
          >
            Recheck
          </Button>
        </Card>
      </section>
    </div>
  );
}

