"use client";
import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { SupabaseUser } from "@/types/backend";
import { SignBy } from "../types/backend";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { userMe, refreshAccessToken } from "@/utils/backend";
import { useRouter } from "next/navigation";

interface UserContextType {
  user: SupabaseUser | null;
  loading: boolean;
  refresh: () => void;
  logIn: (signBy: SignBy) => void;
  logOut: () => void;
}

export const ACCESS_TOKEN_KEY = "AT";
export const REFRESH_TOKEN_KEY = "RT";

const userContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const logIn = useCallback((signBy: SignBy) => {
    window.location.href = `${NEXT_PUBLIC_BACKEND_URL}/v1/auth/${signBy}/`;
  }, []);

  
    const clearAuth = () => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setUser(null);
    };

  const logOut = useCallback(() => {
    clearAuth();
    router.replace("/");
  }, [router]);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return;
    setLoading(true);

    try {
      const { data } = await userMe(token);
      if (data) {
        setUser(data);
      } else {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          clearAuth();
          return;
        }
        const { data: refreshData } = await refreshAccessToken(refreshToken);
        if (refreshData) {
          const { accessToken: newAccesstoken, refreshToken: newRefreshToken } =
            refreshData;
          localStorage.setItem(ACCESS_TOKEN_KEY, newAccesstoken);
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
          const { data: newData } = await userMe(newAccesstoken);
          if (newData) {
            setUser(newData);
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      logIn,
      logOut,
      refresh,
    }),
    [user, loading, logIn, logOut, refresh],
  );

  useEffect(() => {
    if (user || !localStorage.getItem(ACCESS_TOKEN_KEY)) return;
    const fetchUser = async () => {
      refresh();
    };
    fetchUser();
  }, [refresh, user]);

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
export const useUser = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser 必須在 UserProvider 內使用");
  }
  return context;
};
