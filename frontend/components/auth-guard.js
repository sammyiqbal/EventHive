"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/auth-context";

export function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const publicRoutes = ["/login", "/signup", "/"];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isHomePage = pathname === "/";

    // If authenticated and trying to access login/signup, redirect based on role
    if (user && (pathname === "/login" || pathname === "/signup")) {
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
      return;
    }

    // If not authenticated and trying to access protected route (not public), redirect to login
    if (!user && !isPublicRoute) {
      router.push("/login");
      return;
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if redirecting
  const publicRoutes = ["/login", "/signup", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (user && (pathname === "/login" || pathname === "/signup")) {
    return null; // Will redirect to dashboard
  }

  if (!user && !isPublicRoute) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}

