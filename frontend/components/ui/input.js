"use client";

import { forwardRef } from "react";
import { clsx } from "clsx";

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/40",
        className
      )}
      {...props}
    />
  );
});

