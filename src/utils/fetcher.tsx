import { NEXT_PUBLIC_BACKEND_URL } from "@/libs/env";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/contexts/UserContext";

export async function fetcher<T>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  let res = await fetch(...args);

  // 如果遇到 401 錯誤，嘗試使用 refresh token 換取新的 access token
  if (res.status === 401 && typeof window !== "undefined") {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        const refreshRes = await fetch(
          `${NEXT_PUBLIC_BACKEND_URL}/v1/auth/refresh/`,
          {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (refreshRes.ok) {
          const { data } = await refreshRes.json();
          if (data?.accessToken && data?.refreshToken) {
            localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

            // 替換原先請求中的 Authorization Header 再發送一次
            const newArgs = [...args] as Parameters<typeof fetch>;
            if (newArgs[1]) {
              const headers = new Headers(newArgs[1].headers);
              headers.set("Authorization", `Bearer ${data.accessToken}`);
              newArgs[1].headers = headers;
            }
            
            res = await fetch(...newArgs);
          }
        }
      } catch (error) {
        console.error("Token 自動刷新失敗", error);
      }
    }
  }

  if (!res.ok) {
    console.error("Fetch 錯誤：", res.statusText);
  }
  return res.json();
}
