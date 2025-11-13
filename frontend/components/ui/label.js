"use client";

import { clsx } from "clsx";

export function Label({ className, children, ...props }) {
  return (
    <label
      className={clsx("text-sm font-medium text-slate-200", className)}
      {...props}
    >
      {children}
    </label>
  );
}

