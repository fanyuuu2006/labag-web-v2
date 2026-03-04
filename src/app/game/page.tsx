import { Metadata } from "next";
import { MainSection } from "@/components/game/MainSection";

export const metadata: Metadata = {
  title: "遊戲 - 啦八機 LaBaG",
  description: "開始遊玩啦八機 LaBaG，挑戰最高分",
};

export default function Game() {
  return <MainSection />;
}
