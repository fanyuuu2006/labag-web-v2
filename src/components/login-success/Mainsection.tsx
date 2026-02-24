"use client";
import { useRouter } from "next/navigation";
import { GlowText } from "../GlowText";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEY, useUser } from "@/contexts/UserContext";
export const MainSection = () => {
  const router = useRouter();
  const { refresh, user } = useUser();
  const [message, setMessage] = useState("正在登入中...");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // 從 URL 取得 token
    const token = new URLSearchParams(window.location.search).get("token");

    // 一些登入之後的邏輯

    if (token) {
      // 儲存 token 到 localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, token);
      refresh();
      // 使用 setTimeout 避免在 useEffect 中同步更新 state 導致的警告
      setTimeout(() => setMessage("驗證成功，正在取得使用者資料..."), 0);
    } else {
      console.error("未成功取得 Token");
      setTimeout(() => setMessage("登入失敗"), 0);
      setTimeout(() => {
        router.replace("/");
      }, 2000);
    }
  }, [router, refresh]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        router.replace("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  const displayMessage = user ? `歡迎回來，${user.name}！` : message;

  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center">
        <div className="card p-10 md:p-14 text-center w-full max-w-2xl flex flex-col items-center justify-center gap-6">
          <GlowText className="text-3xl md:text-5xl font-bold leading-normal">
            {displayMessage}
          </GlowText>
          {!user && !message.includes("失敗") && (
            <div className="w-12 h-12 rounded-full border-4 border-(--text-color-muted)/20 border-t-(--primary) animate-spin mt-4" />
          )}
        </div>
      </div>
    </section>
  );
};
