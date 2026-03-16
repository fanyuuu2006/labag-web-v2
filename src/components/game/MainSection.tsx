"use client";
import { PatternsDiv } from "./PatternsDiv";
import { MusicAudio } from "./MusicAudio";
import { cn } from "@/utils/className";
import { Pattern } from "labag";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDefaultBet, postSpins, statsById } from "@/utils/backend";
import { ACCESS_TOKEN_KEY, useUser } from "@/contexts/UserContext";
import { useSetting } from "@/contexts/SettingContext";
import { playAudio } from "@/utils/audio";
import { GlowText } from "../GlowText";
import { SupabaseStatsView } from "@/types/backend";

export const MainSection = () => {
  const { user } = useUser();
  const { settings } = useSetting();
  const [spinDisabled, setSpinDisabled] = useState<boolean>(false);
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
    if (spinDisabled) return;

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      alert("請先登入以進行遊戲");
      return;
    }

    if (userStats && userStats.user_coins < defaultBet) {
      alert("持有金額不足，無法轉動");
      return;
    }

    setSpinDisabled(true);
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
        const timer = setTimeout(() => {
          if (!isMounted.current) return;
          
          setPatterns((prev) => {
            const newPatterns = [...prev];
            newPatterns[index] = pattern;
            return newPatterns;
          });
          
          if (settings.sound) {
            playAudio("/audios/ding.mp3", { volume: 0.5 });
          }
        }, (index + 1) * 500);
        
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
          setSpinDisabled(false);
        }
      }, 3500);
      timeoutRefs.current.push(unlockTimer);

    } catch (error) {
      console.error(error);
      if (isMounted.current) {
        alert((error as Error).message || "發生錯誤，請稍後再試");
        setSpinDisabled(false);
      }
    }
  }, [defaultBet, settings.sound, spinDisabled, user, userStats]);

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
    return () => { active = false; };
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
    return () => { active = false; };
  }, [user?.id]);

  const buttonDisabled =
    spinDisabled ||
    (!!user &&
      (defaultBet === 0 || !userStats || userStats.user_coins < defaultBet));

  return (
    <section className="h-full">
      <div className="container h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-end lg:items-center justify-center">
          <PatternsDiv patterns={patterns} className="w-full md:max-w-2xl" />
        </div>
        <aside className="flex flex-col justify-center items-center gap-8 w-full">
          {/* 資訊顯示區 */}
          <div className="card secondary rounded-xl w-full p-6 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-bold text-(--muted)">
                  投注金額
                </span>
                <GlowText className="text-2xl font-bold">
                  {defaultBet}
                </GlowText>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-bold text-(--muted)">
                  持有金額
                </span>
                <GlowText className="text-2xl font-bold">
                  {userStats?.user_coins ?? 0}
                </GlowText>
              </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            <div className="flex flex-col items-center gap-2">
              <span className="text-base font-bold text-(--muted)">
                本次獎勵
              </span>
              <GlowText
                className="text-5xl font-black"
                style={{
                  color:
                    reward !== null && reward > 0
                      ? "var(--primary)"
                      : "inherit",
                }}
              >
                {reward !== null ? reward : "-"}
              </GlowText>
            </div>
          </div>

          {/* 轉動按鈕 */}
          <button
            disabled={buttonDisabled}
            onClick={handleSpin}
            className={cn(
              "w-3/4 btn primary font-bold px-6 py-4 text-2xl md:text-3xl rounded-full disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {spinDisabled ? "轉動中..." : "轉動"}
          </button>
        </aside>
      </div>
      <MusicAudio loop preload="auto" />
    </section>
  );
};
