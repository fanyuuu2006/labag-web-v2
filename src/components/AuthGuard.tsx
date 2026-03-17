"use client";

import { useUser, ACCESS_TOKEN_KEY } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!user && !token && !loading) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
