"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Home, Calendar, Bookmark, Settings, LogOut, PlusCircle } from "lucide-react";

export function Sidebar({ userRole = "student" }) {
  const pathname = usePathname();

  const studentLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/upcoming", label: "Upcoming Events", icon: Calendar },
    { href: "/dashboard/saved", label: "Saved Events", icon: Bookmark },
    { href: "/dashboard/settings", label: "Settings", icon: Settings }
  ];

  const adminLinks = [
    { href: "/dashboard", label: "Manage Events", icon: Home },
    { href: "/dashboard/create", label: "Create Event", icon: PlusCircle },
    { href: "/dashboard/settings", label: "Settings", icon: Settings }
  ];

  const links = userRole === "admin" ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-button text-sm font-medium transition-smooth",
                isActive
                  ? "bg-primary text-white shadow-soft"
                  : "text-text-secondary hover:bg-gray-100 hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
        <button className="flex items-center gap-3 px-4 py-3 rounded-button text-sm font-medium text-text-secondary hover:bg-gray-100 hover:text-red-500 transition-smooth mt-auto">
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}


