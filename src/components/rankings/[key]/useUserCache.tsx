"use client";
import { useEffect, useState } from "react";
import { userById } from "@/utils/backend";
import { SupabaseAllowFieldsUser } from "@/types/backend";

/**
 * `UserData` 是從 `userById` 返回物件中的 `data` 欄位型別，
 * 可能是使用者物件或 `null`（找不到時）。
 */
type UserData = Awaited<ReturnType<typeof userById>>["data"];

/**
 * 快取的條目型別：
 * - `data` 在尚未載入時為 `undefined`。
 * - 載入完成後會是 `UserData` 或 `null`（代表查無此使用者）。
 * - `promise` 在載入中時保存 Promise，避免重複發送相同請求。
 */
type CacheEntry = {
  data?: UserData | null;
  promise?: Promise<UserData | null>;
};

/** 全域快取：以 `userId` 字串為 key */
const userCache = new Map<string, CacheEntry>();

/**
 * Hook: 根據 `userId` 回傳快取的使用者資料（或 null）。
 * 功能與優化：
 * - 避免對同一 userId 重複發送請求（使用 `promise` 共用載入中 promise）。
 * - 將未載入/載入中/已載入（含找不到）以 `data` 的 `undefined|null|object` 三態表示。
 * - 使用 effect-cleanup（mounted flag）避免在 unmount 或 userId 變更後更新 state（防競態）。
 */
export function useUserCache(userId: SupabaseAllowFieldsUser["id"] | null) {
  const [user, setUser] = useState<UserData | null>(() => {
    if (!userId) return null;
    const entry = userCache.get(String(userId));
    // 若快取已載入（data !== undefined）就直接回傳該值（可能為 null）
    return entry?.data !== undefined ? entry.data : null;
  });

  useEffect(() => {
    let mounted = true; // 用於避免在 unmount 時更新 state

    // 若沒有 userId，要清空目前 state（避免顯示舊使用者）
    if (!userId) {
      // 避免在 effect 主體中同步呼叫 setState（會造成連鎖重新渲染，觸發 ESLint 規則）
      // 將清空 state 的操作排入微任務（microtask），讓它在目前 render/effect 週期後執行。
      Promise.resolve().then(() => {
        if (mounted) setUser(null);
      });
      return () => {
        mounted = false;
      };
    }

    const key = String(userId);
    const entry = userCache.get(key);

    // 如果快取已經有明確的 data（非 undefined），直接使用（可能為 null）
    if (entry?.data !== undefined) {
      // 快取已有明確資料：為避免在 effect 中同步 setState（會造成連鎖重新渲染），
      // 把更新排入微任務（microtask），於目前 render/effect 週期後執行。
      Promise.resolve().then(() => {
        if (mounted) setUser(entry.data ?? null);
      });
      return () => {
        mounted = false;
      };
    }

    // 如果已有正在載入的 promise，直接共用並在完成時更新 state
    if (entry?.promise) {
      entry.promise.then((data) => {
        if (!mounted) return;
        setUser(data);
      });
      return () => {
        mounted = false;
      };
    }

    // 尚未載入：建立一個 promise 並先在快取中保留 placeholder（data 為 undefined）
    const p = userById(userId).then(({ data }) => {
      const resolved: UserData | null = data ?? null;
      // 載入完成後，更新快取（移除 promise，保留已解析的 data）
      userCache.set(key, { data: resolved });
      return resolved;
    });

    // 儲存載入中的 promise（使其他 hook 呼叫共用），data 保留為 undefined
    userCache.set(key, { data: undefined, promise: p });

    // 在 promise 完成時，若還掛載則更新 state
    p.then((data) => {
      if (!mounted) return;
      setUser(data);
    });

    return () => {
      mounted = false;
    };
  }, [userId]);

  return user;
}
