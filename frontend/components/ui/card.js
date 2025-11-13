"use client";

import { clsx } from "clsx";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "glass-panel rounded-3xl border border-slate-800/60 bg-slate-900/80 p-8 shadow-lg transition hover:border-slate-700/80 hover:shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

