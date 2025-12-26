"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { GlowText } from "../GlowText";
import { game } from "@/libs/game";
import Link from "next/link";
import { site } from "@/libs/site";

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
          <GlowText
            as="h1"
            className="text-3xl md:text-5xl font-extrabold mb-2"
          >
            GAME OVER
          </GlowText>

          <p className="text-sm text-(--text-color-muted) mb-4">
            遊戲結束 — 你的最終分數
          </p>

          <div className="mb-4">
            <GlowText as="h2" className="text-5xl md:text-7xl font-extrabold">
              {score}
            </GlowText>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              className="btn-primary"
              onClick={handleReplay}
              aria-label="再玩一次"
            >
              再玩一次
            </button>
            <Link className="btn-secondary" href={"/rankings"}>
              排行榜
            </Link>
            <button
              className="btn-tertiary"
              onClick={handleShare}
              aria-label="分享分數"
            >
              分享分數
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
