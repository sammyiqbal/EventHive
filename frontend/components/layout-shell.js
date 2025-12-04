"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Youtube, Twitter } from "lucide-react";
import { Header } from "./header";

export function LayoutShell({ children }) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="layout-shell"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex min-h-screen w-full flex-col"
      >
        {/* Header - full-width bar at very top, sticky on scroll */}
        {!isAuthPage && (
          <div className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl px-6 md:px-10">
              <Header />
            </div>
          </div>
        )}

        {/* Main content container */}
        <main className="flex flex-1 w-full">
          <div
            className={`mx-auto flex w-full ${
              isAuthPage ? "max-w-4xl" : "max-w-6xl"
            } flex-col px-6 py-8 md:px-10 md:py-12`}
          >
            {children}
          </div>
        </main>

        {/* Footer - full-width bar at bottom */}
        {!isAuthPage && (
          <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-3 text-sm text-slate-200 md:py-7">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:gap-8 md:px-10">
              {/* Left: Brand block (text-only) */}
              <div className="flex items-center justify-center gap-2 text-center md:justify-start md:text-left">
                <div className="flex flex-col leading-tight">
                  <span className="brand-title">
                    EventHive
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-300 sm:text-[11px]">
                    hive moments
                  </span>
                </div>
              </div>

              {/* Center: Footer nav links */}
              <nav className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium text-slate-300 md:mt-0 md:text-sm md:gap-x-10 md:gap-y-3">
                <button className="transition hover:text-white" type="button">
                  Terms &amp; Conditions
                </button>
                <button className="transition hover:text-white" type="button">
                  Privacy Policy
                </button>
                <button className="transition hover:text-white" type="button">
                  Contact Us
                </button>
              </nav>

              {/* Right: Social icons */}
              <div className="mt-2 flex flex-col items-center gap-2 md:mt-0 md:items-end md:gap-3">
                <p className="text-xs text-slate-400 text-center md:text-right">
                  Stay connected with EventHive
                </p>
                <div className="flex items-center justify-center gap-3 text-slate-100">
                  <button
                    type="button"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-[30%] border border-slate-600/80 bg-slate-900/70 hover:border-primary-300 hover:text-primary-100 transition"
                  >
                    <Instagram className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="X"
                    className="flex h-9 w-9 items-center justify-center rounded-[30%] border border-slate-600/80 bg-slate-900/70 hover:border-primary-300 hover:text-primary-100 transition"
                  >
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="YouTube"
                    className="flex h-9 w-9 items-center justify-center rounded-[30%] border border-slate-600/80 bg-slate-900/70 hover:border-primary-300 hover:text-primary-100 transition"
                  >
                    <Youtube className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom legal line - more compact on mobile */}
            <div className="mt-4 border-t border-slate-800/80 pt-3 text-center text-[11px] leading-relaxed text-slate-400 md:mt-6 md:text-xs">
              <p className="hidden md:block">
                By accessing this page, you confirm that you have read, understood, and
                agreed to our Terms of Service, Cookie Policy, Privacy Policy, and
                Content Guidelines. All rights reserved. © {currentYear} EventHive.
              </p>
              <p className="block md:hidden">
                All rights reserved. © {currentYear} EventHive.
              </p>
            </div>
          </footer>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

