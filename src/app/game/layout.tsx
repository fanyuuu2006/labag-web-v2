import { site } from "@/libs/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "遊戲",
  description: "開始遊玩啦八機 LaBaG，挑戰最高分",
  alternates: {
    canonical: "/game",
  },
  openGraph: {
    title: `開始遊玩 | ${site.title}`,
    description: "開始遊玩啦八機 LaBaG，挑戰最高分",
    url: "/game",
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
