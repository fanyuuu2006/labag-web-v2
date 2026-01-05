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
    const url = site.url.toString();
    const shareData = {
      title: "LaBaG 分數",
      text,
      url,
    };

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${url}`);
        console.log("已複製分數與連結！");
      } else {
        console.warn("您的瀏覽器不支援分享功能");
      }
    } catch (e) {
      console.error("分享失敗：", e);
    }
  }, [score]);

  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center">
        <div className="card p-6 md:p-8 text-center w-full max-w-2xl">
          <h1 className="text-(--text-color-primary) text-3xl md:text-5xl font-extrabold mb-2">
            GAME OVER
          </h1>

          <p className="text-base text-(--text-color-muted) mb-8 font-medium">
            遊戲結束 — 你的最終分數
          </p>

          <div
            className="mb-8 transform transition-transform hover:scale-105 duration-300"
            role="status"
            aria-live="polite"
          >
            <GlowText
              as="h2"
              onClick={handleShare}
              aria-label={`你的分數是 ${score}，點擊以分享`}
              className="cursor-pointer text-6xl md:text-8xl font-black tracking-wider select-none"
            >
              <span className="sr-only">你的分數：</span>
              {score.toLocaleString()}
            </GlowText>
            <p className="text-xs text-(--text-color-muted) mt-3">
              (點擊分數分享)
            </p>
          </div>

          <nav
            aria-label="遊戲結束操作"
            className=" text-lg flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full px-4"
          >
            <button
              className="btn-primary font-bold rounded-2xl py-3 px-8"
              onClick={handleReplay}
              aria-label="再玩一次"
              title="再玩一次"
            >
              再玩一次
            </button>
            <Link
              className="btn-secondary rounded-2xl py-3 px-8"
              href={"/rankings"}
              title="查看排行榜"
            >
              排行榜
            </Link>
            <DownloadRecordButton
              className="btn-tertiary rounded-2xl py-3 px-8"
              aria-label="下載遊戲紀錄"
              title="下載遊戲紀錄"
            >
              下載紀錄
            </DownloadRecordButton>
          </nav>
        </div>
      </div>
    </section>
  );
};
