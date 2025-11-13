"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" }
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/70 px-6 py-4 shadow-glow backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white shadow-glow">
          EH
        </span>
        <span className="hidden sm:inline gradient-text text-xl font-semibold">EventHive</span>
      </Link>

      <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "transition hover:text-white",
              pathname === link.href && "text-white"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" className="hidden md:inline-flex">
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild className="shadow-glow">
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    </header>
  );
}

