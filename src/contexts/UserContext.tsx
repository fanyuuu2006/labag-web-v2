"use client";
import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { BackendResponse } from "@/types/api";
import { User } from "@/types/user";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";

interface UserContextType {
  user: User | null;
  loading: boolean;
  refresh: () => void;
  logIn: () => void;
  logOut: () => void;
}

const userContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const logIn = useCallback(() => {
    window.location.href = `${NEXT_PUBLIC_BACKEND_URL}/v1/auth/google`;
  }, []);
  const logOut = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
  }, []);
  const refresh = useCallback(() => {
    setLoading(true);
    fetch(`${NEXT_PUBLIC_BACKEND_URL}/v1/users/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("獲取個人資料失敗");
        }
        const data: BackendResponse<User> = await res.json();
        setUser(data.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      logIn,
      logOut,
      refresh,
    }),
    [user, loading, logIn, logOut, refresh]
  );
   useEffect(() => {
    if (typeof window === "undefined") return; // 避免伺服器端執行
    Promise.resolve().then(() => refresh());
  }, [refresh]);

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export const useUser = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser 必須在 UserProvider 內使用");
  }
  return context;
};
