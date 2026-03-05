import { Metadata } from "next";

export const metadata: Metadata = {
  title: "遊戲",
  description: "開始遊玩啦八機 LaBaG，挑戰最高分",
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
