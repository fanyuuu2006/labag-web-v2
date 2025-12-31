"use client";
import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { BackendResponse } from "@/types/api";
import { User } from "@/types/user";
import { SignBy } from "../types/api";
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
  logIn: (signBy: SignBy) => void;
  logOut: () => void;
}

export const LOCAL_STORAGE_KEY = "authToken";

const userContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const logIn = useCallback((signBy: SignBy) => {
    window.location.href = `${NEXT_PUBLIC_BACKEND_URL}/v1/auth/${signBy}/`;
  }, []);
  const logOut = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
  }, []);
  const refresh = useCallback(() => {
    setLoading(true);
    fetch(`${NEXT_PUBLIC_BACKEND_URL}/v1/data/users/profile`, {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem(LOCAL_STORAGE_KEY) || ""
        }`,
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
    if (user || !localStorage.getItem(LOCAL_STORAGE_KEY)) return;
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
