"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./header";

export function LayoutShell({ children }) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="layout-shell"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 md:px-10 md:py-12"
      >
        <Header />
        <main className="flex flex-1 flex-col py-8 md:py-12">{children}</main>
        <footer className="py-10 text-center text-sm text-slate-500">
          © {currentYear} EventHive. Crafted with flair.
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}

