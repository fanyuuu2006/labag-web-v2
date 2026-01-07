"use client";
import { useRouter } from "next/navigation";
import { GlowText } from "../GlowText";
import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "@/contexts/UserContext";

export const MainSection = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // 從 URL 取得 token
    const token = new URLSearchParams(window.location.search).get("token");

    // 一些登入之後的邏輯
    
    if (token) {
      // 儲存 token 到 localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, token);
      //  

    } else {
      console.error("未成功取得 Token");
    }
    router.replace("/"); // 跳回登入頁面
  }, [router]);

  return (
    <section className="h-full">
      <div className="container">
        <div className="w-full h-full flex items-center justify-center">
          <GlowText className="text-3xl font-semibold">登入中</GlowText>
        </div>
      </div>
    </section>
  );
};
