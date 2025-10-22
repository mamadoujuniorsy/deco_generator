"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface UseProtectedRouteOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
  const { redirectTo = "/auth/signin", requireAuth = true } = options;
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (state.isLoading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !state.isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // If user is authenticated but shouldn't be on this page (like login page)
    if (!requireAuth && state.isAuthenticated) {
      router.push("/dashboard"); // or wherever authenticated users should go
      return;
    }
  }, [state.isAuthenticated, state.isLoading, requireAuth, redirectTo, router]);

  return {
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  };
};
