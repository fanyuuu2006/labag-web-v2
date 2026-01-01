"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { GlowText } from "../GlowText";
import { game } from "@/libs/game";
import Link from "next/link";
import { site } from "@/libs/site";
import { DownloadRecordButton } from "./DownloadRecordButton";

export const MainSection = () => {
  const router = useRouter();
  const [score] = useState<number>(game.score || 0);

  const handleReplay = useCallback(() => {
    game.init();
    router.replace("/game");
  }, [router]);

  const handleShare = useCallback(async () => {
    const text = `我的 LaBaG 分數：${score} 分！來挑戰我！`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "LaBaG 分數",
          text,
          url: site.url.toString(),
        });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${site.url.toString()}`);
      }
    } catch (e) {
      console.error("分享失敗：", e);
    }
  }, [score]);

  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center">
        <div className="card p-6 text-center w-full max-w-xl">
          <h1 className="text-(--text-color-primary) text-3xl md:text-5xl font-extrabold mb-2">
            GAME OVER
          </h1>

          <p className="text-sm text-(--text-color-muted) mb-4">
            遊戲結束 — 你的最終分數
          </p>

          <div className="mb-4" role="status" aria-live="polite">
            <GlowText
              as="h2"
              onClick={handleShare}
              aria-label="點擊以分享分數"
              className="cursor-pointer text-5xl md:text-7xl font-extrabold"
            >
              <span className="sr-only">你的分數：</span>
              {score}
            </GlowText>
          </div>

          <nav aria-label="遊戲結束操作" className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              className="btn-primary font-bold rounded-2xl py-2 px-6"
              onClick={handleReplay}
              aria-label="再玩一次"
              title="再玩一次"
            >
              再玩一次
            </button>
            <Link className="btn-secondary rounded-2xl py-2 px-6" href={"/ranking"} title="查看排行榜">
              排行榜
            </Link>
            <DownloadRecordButton className="btn-tertiary rounded-2xl py-2 px-6" aria-label="下載遊戲紀錄" title="下載遊戲紀錄">
              下載遊戲紀錄
            </DownloadRecordButton>
          </nav>
        </div>
      </div>
    </section>
  );
};
