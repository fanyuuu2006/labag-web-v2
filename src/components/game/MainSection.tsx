"use client";
import { PatternsDiv } from "./PatternsDiv";
import { MusicAudio } from "./MusicAudio";
import { cn } from "@/utils/className";
import { Pattern } from "labag";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDefaultBet, postSpins, statsById } from "@/utils/backend";
import { ACCESS_TOKEN_KEY, useUser } from "@/contexts/UserContext";
import { useSetting } from "@/contexts/SettingContext";
import { playAudio } from "@/utils/audio";
import { GlowText } from "../GlowText";
import { SupabaseStatsView } from "@/types/backend";

const REVEAL_DURATION = 500; // 每個 Pattern 揭示的時間間隔，單位為毫秒

export const MainSection = () => {
  const { user } = useUser();
  const { settings } = useSetting();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [defaultBet, setDefaultBet] = useState<number>(0);
  const [patterns, setPatterns] = useState<(Pattern | null)[]>([
    null,
    null,
    null,
  ]);
  const [reward, setReward] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<SupabaseStatsView | null>(null);

  // 用於追蹤組件掛載狀態與清除計時器
  const isMounted = useRef(true);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  const handleSpin = useCallback(async () => {
    if (isSpinning) return;

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      alert("請先登入以進行遊戲");
      return;
    }

    if (userStats && userStats.user_coins < defaultBet) {
      alert("持有金額不足，無法轉動");
      return;
    }

    setIsSpinning(true);
    setPatterns([null, null, null]);
    setReward(null);

    // 清除舊的計時器
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    try {
      const response = await postSpins(token);
      if (!response.data) {
        throw new Error(response.message || "轉動失敗，請稍後再試");
      }

      const { reels, reward: newReward } = response.data;

      // 設置每個捲軸的動畫
      reels.forEach((pattern, index) => {
        const timer = setTimeout(
          () => {
            if (!isMounted.current) return;

            setPatterns((prev) => {
              const newPatterns = [...prev];
              newPatterns[index] = pattern;
              return newPatterns;
            });

            if (settings.sound) {
              playAudio("/audios/ding.mp3", { volume: 0.5 });
            }
          },
          (index + 1) * REVEAL_DURATION,
        );

        timeoutRefs.current.push(timer);
      });

      // 設置獎勵顯示結果
      const rewardTimer = setTimeout(() => {
        if (!isMounted.current) return;

        setReward(newReward);
        if (user?.id) {
          statsById(user.id).then((res) => {
            if (isMounted.current && res.data) {
              setUserStats(res.data);
            }
          });
        }
      }, 3000);
      timeoutRefs.current.push(rewardTimer);

      // 解除按鈕鎖定
      const unlockTimer = setTimeout(() => {
        if (isMounted.current) {
          setIsSpinning(false);
        }
      }, 3500);
      timeoutRefs.current.push(unlockTimer);
    } catch (error) {
      console.error(error);
      if (isMounted.current) {
        alert((error as Error).message || "發生錯誤，請稍後再試");
        setIsSpinning(false);
      }
    }
  }, [defaultBet, settings.sound, isSpinning, user, userStats]);

  useEffect(() => {
    let active = true;
    getDefaultBet()
      .then((response) => {
        if (active && response.data) {
          setDefaultBet(response.data);
        } else if (active) {
          console.warn("無法取得預設投注金額");
        }
      })
      .catch((error) => {
        if (active) console.error("取得預設投注金額失敗:", error);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (user?.id) {
      statsById(user.id).then((res) => {
        if (active && res.data) {
          setUserStats(res.data);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [user?.id]);

  const buttonDisabled = useMemo(() => {
    return (
      isSpinning ||
      (!!user &&
        (defaultBet === 0 || !userStats || userStats.user_coins < defaultBet))
    );
  }, [isSpinning, user, defaultBet, userStats]);

  const displayStats = useMemo(
    () => [
      {
        label: "投注金額",
        value: defaultBet,
        colSpan: 1,
        isLarge: false,
      },
      {
        label: "持有金額",
        value: userStats?.user_coins ?? 0,
        colSpan: 1,
        isLarge: false,
      },
      {
        label: "本次獎勵",
        value: reward !== null ? reward : "-",
        colSpan: 2,
        isLarge: true,
      },
    ],
    [defaultBet, userStats, reward],
  );

  return (
    <section className="h-full">
      <div className="container h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-end lg:items-center justify-center">
          <PatternsDiv
            patterns={patterns}
            isSpinning={isSpinning}
            className="w-full md:max-w-2xl"
          />
        </div>
        <aside className="flex flex-col justify-center items-center gap-8 w-full">
          {/* 資訊顯示區 */}
          <div className="w-full grid grid-cols-2 gap-4">
            {displayStats.map((stat, index) => (
              <div
                key={index}
                className={cn(
                  "card secondary flex flex-col items-center justify-center transition-all",
                  stat.isLarge ? "p-6 gap-4" : "p-4 gap-2",
                  stat.colSpan === 2 ? "col-span-2" : "col-span-1",
                )}
              >
                <span
                  className={cn(
                    "font-bold text-(--muted)",
                    stat.isLarge ? "text-base" : "text-sm",
                  )}
                >
                  {stat.label}
                </span>
                <GlowText
                  className={cn(
                    "font-bold transition-all duration-300",
                    stat.isLarge ? "text-5xl font-black" : "text-2xl",
                  )}
                >
                  {stat.value}
                </GlowText>
              </div>
            ))}
          </div>

          {/* 轉動按鈕 */}
          <button
            disabled={buttonDisabled}
            onClick={handleSpin}
            className={cn(
              "w-3/4 btn primary font-bold px-6 py-4 text-2xl md:text-3xl rounded-full disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {isSpinning ? "轉動中..." : "轉動"}
          </button>
        </aside>
      </div>
      <MusicAudio loop preload="auto" />
    </section>
  );
};
