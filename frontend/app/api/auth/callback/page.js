"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../../contexts/auth-context";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        authLogin(token, user, true);
        // Redirect based on role
        if (user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login?error=oauth_failed");
      }
    } else {
      const error = searchParams.get("error");
      router.push(`/login?error=${error || "oauth_failed"}`);
    }
  }, [searchParams, router, authLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-white">Completing authentication...</p>
      </div>
    </div>
  );
}

