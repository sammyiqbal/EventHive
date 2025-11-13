"use client";

import { clsx } from "clsx";
import { Slot } from "@radix-ui/react-slot";

const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  solid:
    "bg-primary-500 text-white hover:bg-primary-400 hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline-primary-300",
  ghost: "bg-transparent text-slate-200 hover:text-white hover:bg-slate-800/60",
  outline:
    "border border-slate-700 bg-transparent text-slate-100 hover:border-primary-400 hover:text-white hover:bg-slate-800/70",
  subtle:
    "border border-slate-700/70 bg-slate-800/70 text-slate-100 hover:bg-slate-700/70 hover:text-white"
};

export function Button({ asChild = false, variant = "solid", className, children, ...props }) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={clsx(base, variants[variant], className)}
      {...(!asChild ? { type: "button" } : {})}
      {...props}
    >
      {children}
    </Component>
  );
}

