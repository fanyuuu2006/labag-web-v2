import { Metadata } from "next";
import { MainSection } from "@/components/rankings/Mainsection";

export const metadata: Metadata = {
  title: "排行榜",
  description: "查看啦八機 LaBaG 的最新排名和紀錄",
};

export default function Rankings() {
    return <MainSection />;
}