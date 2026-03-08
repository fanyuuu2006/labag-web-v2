import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/contexts/UserContext";

// 用來記錄當前是否正在刷新 Token 的 Promise，避免並發請求（Thundering Herd）產生多個 Refresh Token 請求
let refreshTokenPromise: Promise<string | null> | null = null;

async function getNewToken(refreshToken: string): Promise<string | null> {
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
  return refreshTokenPromise;
}

export async function fetcher<T>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  let res = await fetch(...args);

  // 判斷當前請求是否本身就是 Refresh Token API 
  // (避免外部直接呼叫 refreshToken API 時若 401 觸發自己攔截自己的無窮迴圈)
  const requestUrl = args[0] instanceof Request ? args[0].url : args[0].toString();
  const isRefreshApi = requestUrl.includes('/v1/auth/refresh');

  // 如果遇到 401 錯誤，且不是 refresh API 自身，就嘗試使用 refresh token 換取新的 access token
  if (res.status === 401 && !isRefreshApi && typeof window !== "undefined") {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (refreshToken) {
      const newToken = await getNewToken(refreshToken);

      if (newToken) {
        // 取得新 Token 後，替換原請求中的 Authorization Header 並且重試
        const newArgs = [...args] as Parameters<typeof fetch>;
        const originalOptions = newArgs[1] || {};
        
        const headers = new Headers(originalOptions.headers);
        headers.set("Authorization", `Bearer ${newToken}`);
        
        newArgs[1] = {
          ...originalOptions,
          headers
        };
        
        res = await fetch(...newArgs);
      } else {
        // Token 完全無效（Refresh 也失敗時），可以直接清除狀態引導重新登入
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    }
  }

  if (!res.ok) {
    console.error("Fetch 錯誤：", res.status, res.statusText);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  
  return res.text() as unknown as Promise<T>;
}
