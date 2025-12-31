"use client";
import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { BackendResponse, SupabaseRecord, SupabaseUser } from "@/types/backend";
import { SignBy } from "../types/backend";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { game } from "@/libs/game";
import { fetcher } from "@/utils/fetcher";
import { recorder } from "@/libs/recorder";
import { userProfile } from "@/utils/backend";

interface UserContextType {
  user: SupabaseUser | null;
  loading: boolean;
  refresh: () => void;
  logIn: (signBy: SignBy) => void;
  logOut: () => void;
}

export const LOCAL_STORAGE_KEY = "authToken";

const userContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const logIn = useCallback((signBy: SignBy) => {
    window.location.href = `${NEXT_PUBLIC_BACKEND_URL}/v1/auth/${signBy}/`;
  }, []);
  const logOut = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
  }, []);
  const refresh = useCallback(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!token) return;
    setLoading(true);
    userProfile(token)
      .then((data) => {
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

  useEffect(() => {
    if (!user) return;
    const handleGameOver = (g: typeof game) => {
      fetcher<BackendResponse<SupabaseRecord>>(
        `${NEXT_PUBLIC_BACKEND_URL}/v1/data/records/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem(LOCAL_STORAGE_KEY) || ""
            }`,
          },
          body: JSON.stringify({
            score: g.score,
            user_id: user.id,
            record: recorder.getRecord(),
          }),
        }
      )
        .then((res) => {
          console.log("上傳分數成功", res);
        })
        .catch((err) => {
          console.error("上傳分數失敗", err);
        });
    };
    game.addEventListener("gameOver", handleGameOver);
    return () => {
      game.removeEventListener("gameOver", handleGameOver);
    };
  }, [user]);

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};
export const useUser = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser 必須在 UserProvider 內使用");
  }
  return context;
};
