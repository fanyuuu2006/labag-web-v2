"use client";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const MainSection = () => {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      // 已登入，導向 profile 頁面
      router.push(`/profile/${user.id}`);
    }
  }, [router, user]);

  return (
    <section className="h-full">
      <div className="contianer h-full">{user ? <></> : <></>}</div>
    </section>
  );
};
