"use client";

import { Sidebar } from "./sidebar";

export function DashboardLayout({ children, userRole = "student" }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}


