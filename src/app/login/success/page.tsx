import { MainSection } from "@/components/login/success/Mainsection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登入成功",
  description: "登入成功，將跳轉至上一頁",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginSeccess() {
  
  return (
    <MainSection />
  );
}
