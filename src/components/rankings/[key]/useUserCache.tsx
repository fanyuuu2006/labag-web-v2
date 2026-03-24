"use client";
import { useEffect, useState } from "react";
import { userById } from "@/utils/backend";
import { SupabaseAllowFieldsUser } from "@/types/backend";

type UserData = Awaited<ReturnType<typeof userById>>["data"];

const userCache = new Map<
  string,
  { data: UserData; promise?: Promise<UserData> }
>();

export function useUserCache(userId: SupabaseAllowFieldsUser["id"] | null) {
  const [user, setUser] = useState<UserData>(() => {
    if (!userId) return null;
    const entry = userCache.get(userId.toString());
    return entry?.data ?? null;
  });

  useEffect(() => {
    if (!userId) return;
    const entry = userCache.get(userId.toString());
    if (entry?.data) {
      setTimeout(() => {
        setUser(entry.data);
      }, 0); // 確保與 promise.then 的 setUser 不會衝突
      return;
    }
    if (entry?.promise) {
      entry.promise.then((data) => setUser(data ?? null));
      return;
    }

    const p = userById(userId).then(({ data }) => {
      const resolved = data ?? null;
      userCache.set(userId.toString(), { data: resolved });
      return resolved;
    });

    userCache.set(userId.toString(), { data: null, promise: p });
    p.then((data) => setUser(data ?? null));
  }, [userId]);

  return user;
}
