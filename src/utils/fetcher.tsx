import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/contexts/UserContext";

// 用來記錄當前是否正在刷新 Token 的 Promise，避免並發請求（Thundering Herd）產生多個 Refresh Token 請求
let refreshTokenPromise: Promise<string | null> | null = null;

export async function fetcher<T>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  let res = await fetch(...args);

  // 如果遇到 401 錯誤，嘗試使用 refresh token 換取新的 access token
  if (res.status === 401 && typeof window !== "undefined") {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (refreshToken) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = fetch(
          `${NEXT_PUBLIC_BACKEND_URL}/v1/auth/refresh/`,
          {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then(async (refreshRes) => {
            if (refreshRes.ok) {
              const { data } = await refreshRes.json();
              if (data?.accessToken && data?.refreshToken) {
                localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
                localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
                return data.accessToken as string;
              }
            }
            return null;
          })
          .catch((error) => {
            console.error("Token 自動刷新失敗", error);
            return null;
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      const newToken = await refreshTokenPromise;

      if (newToken) {
        // 取得新 Token 後，替換原請求中的 Authorization Header 並且重試
        const newArgs = [...args] as Parameters<typeof fetch>;
        if (newArgs[1]) {
          const headers = new Headers(newArgs[1].headers);
          headers.set("Authorization", `Bearer ${newToken}`);
          newArgs[1].headers = headers;
        } else {
          newArgs[1] = {
            headers: { Authorization: `Bearer ${newToken}` }
          };
        }
        
        res = await fetch(...newArgs);
      } else {
        // Token 完全無效（Refresh 也失敗時），可以直接清除狀態引導重新登入
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  }

  if (!res.ok) {
    console.error("Fetch 錯誤：", res.statusText);
  }
  return res.json();
}
