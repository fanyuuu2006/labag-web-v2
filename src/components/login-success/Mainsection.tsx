"use client";
import { useRouter } from "next/navigation";
import { GlowText } from "../GlowText";
import { useEffect } from "react";
import { LOCAL_STORAGE_KEY, useUser } from "@/contexts/UserContext";
import { useUserModal } from "@/contexts/UserModalContext";

export const MainSection = () => {
  const router = useRouter();
  const { user } = useUser();
  const modal = useUserModal();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // 從 URL 取得 token
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      // 儲存 token 到 localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, token);
      if (user){
        modal.open(user.id);
      }
    } else {
      console.error("未成功取得 Token");
    }
    router.replace("/"); // 跳回登入頁面
  }, [modal, router, user]);

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