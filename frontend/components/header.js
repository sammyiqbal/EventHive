"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/auth-context";
import { User, LogOut, Settings, Calendar, Home, Search, LayoutDashboard, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setShowProfileMenu(false);
  };

  const navLinks = user
    ? [
        { href: "/", label: "Home", icon: Home },
        { href: "/events", label: "Events", icon: Search },
        ...(user.role === "admin"
          ? [
              { href: "/dashboard/admin", label: "Admin Dashboard", icon: LayoutDashboard },
            ]
          : [
              { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            ]),
      ]
    : [
        { href: "/login", label: "Login" },
        { href: "/signup", label: "Sign Up" },
      ];

  const pageTitles = {
    "/": "Home",
    "/events": "Events",
    "/dashboard": "Dashboard",
    "/dashboard/admin": "Admin Dashboard",
    "/profile": "Profile"
  };

  const currentPageTitle = pageTitles[pathname] || "";

  return (
    <header className="relative flex w-full items-center justify-between gap-3 py-3 md:gap-8 md:py-4">
      {/* Left: logo */}
      <Link
        href={user ? "/" : "/login"}
        className="flex items-center gap-2 md:gap-3"
      >
        <div className="flex flex-col leading-tight">
          <span className="brand-title">
            EventHive
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-300 sm:text-[11px]">
            hive moments
          </span>
        </div>
      </Link>

      {/* Center: page title on mobile, navigation on desktop */}
      <div className="flex flex-1 items-center justify-center">
        {currentPageTitle && (
          <span className="block text-sm font-semibold tracking-wide text-slate-100 md:hidden">
            {currentPageTitle}
          </span>
        )}
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium text-slate-300 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-2 transition hover:text-white",
                  pathname === link.href && "text-white"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: Mobile Menu Button + Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition md:hidden"
        >
          {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && user && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-white/20 bg-slate-900/95 px-2 backdrop-blur-xl shadow-lg md:hidden">
          <nav className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white",
                    pathname === link.href && "bg-white/10 text-white"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-white/10 pt-2">
              <Link
                href="/profile"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Settings className="h-5 w-5" />
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </div>
          </nav>
        </div>
      )}

        <div className="hidden items-center gap-3 md:flex">
        {user ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/20 text-primary-200">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden md:inline">{user.name || user.email}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/20 bg-slate-900/95 backdrop-blur-xl shadow-lg">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-slate-400 border-b border-white/10 mb-2">
                    <p className="font-medium text-white">{user.name || "User"}</p>
                    <p className="text-xs">{user.email}</p>
                    <p className="mt-1 text-xs capitalize">{user.role}</p>
                  </div>
                  
                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 rounded-lg transition hover:bg-white/10 hover:text-white w-full"
                  >
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg transition hover:bg-red-500/10 hover:text-red-300 w-full mt-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="shadow-glow">
              <Link href="/signup">Get Started</Link>
            </Button>
          </>
        )}
        </div>
      </div>
    </header>
  );
}

