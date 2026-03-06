import { MainSection } from "@/components/game/over/Mainsection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "遊戲結束",
  description: "遊戲結束，查看你的成績",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Game() {
  return <MainSection/>;
}
