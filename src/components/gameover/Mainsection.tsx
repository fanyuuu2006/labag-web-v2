"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlowText } from "../GlowText";
import { game } from "@/libs/game";

export const MainSection = () => {
  const router = useRouter();
  const [score, setScore] = useState<number>(game.score || 0);
  const [margin, setMargin] = useState<number>(game.marginScore || 0);

  useEffect(() => {
    // read final stats from game
    setScore(game.score || 0);
    setMargin(game.marginScore || 0);
  }, []);

  const handleReplay = useCallback(() => {
    router.push("/game");
  }, [router]);

  const handleRankings = useCallback(() => {
    router.push("/rankings");
  }, [router]);

  const handleShare = useCallback(async () => {
    const text = `我的 LaBaG 分數：${score} 分！來挑戰我！`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "LaBaG 分數", text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert("分數已複製到剪貼簿！");
      } else {
        alert(text);
      }
    } catch (e) {
        console.error("分享失敗：", e);
    }
  }, [score]);

  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center gap-6">
        <div className="card p-6 text-center w-full max-w-xl">
            <GlowText as="h1" className="text-3xl md:text-5xl font-extrabold mb-2">
              GAME OVER
            </GlowText>

            <p className="text-sm text-gray-300 mb-4" style={{ color: "var(--text-color-muted)" }}>
              遊戲結束 — 你的最終分數
            </p>

            <div className="mb-4">
              <GlowText as="div" className="text-5xl md:text-7xl font-extrabold">
                {score}
              </GlowText>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button className="btn-primary" onClick={handleReplay}>
                再玩一次
              </button>
              <button className="btn-secondary" onClick={handleRankings}>
                排行榜
              </button>
              <button className="btn-tertiary" onClick={handleShare}>
                分享分數
              </button>
            </div>
        </div>
      </div>
    </section>
  );
};
