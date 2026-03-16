"use client";
import { PatternsDiv } from "./PatternsDiv";
import { MusicAudio } from "./MusicAudio";
import { cn } from "@/utils/className";
import { Pattern } from "labag";
import { useCallback, useEffect, useState } from "react";
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

    try {
      const response = await postSpins(token);
      if (!response.data) {
        alert(response.message || "轉動失敗，請稍後再試");
        return;
      }

      response.data.reels.forEach((pattern, index) => {
        setTimeout(
          () => {
            setPatterns((prev) => {
              const newPatterns = [...prev];
              newPatterns[index] = pattern;
              return newPatterns;
            });
            if (settings.sound) {
              playAudio("/audios/ding.mp3", {
                volume: 0.5,
              });
            }
          },
          (index + 1) * 500,
        );

        setTimeout(() => {
          if (response.data) {
            setReward(response.data.reward);
            if (user?.id) {
              statsById(user.id).then((res) => {
                if (res.data) {
                  setUserStats(res.data);
                }
              });
            }
          }
        }, 3000);
      });
    } catch (error) {
      console.error(error);
      alert("發生錯誤，請稍後再試");
    } finally {
      setTimeout(() => {
        setSpinDisabled(false);
      }, 3500);
    }
  }, [defaultBet, settings.sound, spinDisabled, user, userStats]);

  useEffect(() => {
    getDefaultBet()
      .then((response) => {
        if (response.data) {
          setDefaultBet(response.data);
        } else {
          console.warn("無法取得預設投注金額");
        }
      })
      .catch((error) => {
        console.error("取得預設投注金額失敗:", error);
      });
  }, []);

  useEffect(() => {
    if (user?.id) {
      statsById(user.id).then((res) => {
        if (res.data) {
          setUserStats(res.data);
        }
      });
    }
  }, [user?.id]);

  const buttonDisabled =
    spinDisabled || (userStats ? userStats.user_coins < defaultBet : false);

  return (
    <section className="h-full">
      <div className="container h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-end lg:items-center justify-center">
          <PatternsDiv patterns={patterns} className="w-full md:max-w-2xl" />
        </div>
        <aside className="flex flex-col justify-start lg:justify-center items-center gap-4 md:gap-6">
          {/* 資訊顯示區 */}
          <div className="w-full card secondary rounded-xl p-5 sm:p-6 flex flex-col gap-3 sm:gap-4 items-start">
            <GlowText
              as="h2"
              className="text-base sm:text-lg md:text-2xl font-bold mb-1"
            >
              資訊面板
            </GlowText>

            <div className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-bold text-(--muted)">
                投注金額
              </span>
              <GlowText className="text-lg sm:text-xl font-bold">
                {defaultBet}
              </GlowText>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-bold text-(--muted)">
                持有金額
              </span>
              <GlowText className="text-lg sm:text-xl font-bold">
                {userStats?.user_coins ?? 0}
              </GlowText>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm sm:text-base font-bold text-(--muted)">
                本次獎勵
              </span>
              <GlowText
                className="text-lg sm:text-xl font-bold"
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
              "w-3/4 btn primary font-bold px-6 py-3 text-2xl md:text-3xl lg:text-4xl rounded-full",
            )}
          >
            轉動
          </button>
        </aside>
      </div>
      <MusicAudio loop preload="auto" />
    </section>
  );
};
