"use client";
import { GlowText } from "@/components/GlowText";
import { LOCAL_STORAGE_KEY } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginSeccess() {
  const router = useRouter();

  useEffect(() => {
    // 從 URL 取得 token
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      // 儲存 token 到 localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, token);
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
}
