"use client";
import { PatternsDiv } from "./PatternsDiv";
import { MusicAudio } from "./MusicAudio";
import { cn } from "@/utils/className";
import { Pattern } from "labag";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getBets, postSpins, statsById } from "@/utils/backend";
import { ACCESS_TOKEN_KEY, useUser } from "@/contexts/UserContext";
import { useSetting } from "@/contexts/SettingContext";
import { playAudio } from "@/utils/audio";
import { GlowText } from "../GlowText";
import { SupabaseStatsView } from "@/types/backend";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
const REVEAL_DURATION = 500; // 每個 Pattern 揭示的時間間隔，單位為毫秒

export const MainSection = () => {
  const { user } = useUser();
  const { settings } = useSetting();
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [bets, setBets] = useState<number[]>([]);
  const [Bet, settBet] = useState<number>(0);
  const [currSpin, setCurrSpin] = useState<
    Awaited<ReturnType<typeof postSpins>>["data"] | null
  >(null);
  const [userStats, setUserStats] = useState<SupabaseStatsView | null>(null);
  const [patterns, setPatterns] = useState<(Pattern | null)[]>([
    null,
    null,
    null,
  ]);

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

    if (userStats && userStats.user_coins < Bet) {
      alert("持有金額不足，無法轉動");
      return;
    }

    setIsSpinning(true);
    setPatterns([null, null, null]);
    setCurrSpin(null);

    // 清除舊的計時器
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    try {
      const response = await postSpins(token, Bet);
      if (!response.data) {
        throw new Error(response.message || "轉動失敗，請稍後再試");
      }

      const { reels } = response.data;

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

        if (user?.id) {
          statsById(user.id).then((res) => {
            if (isMounted.current && res.data) {
              setUserStats(res.data);
            }
          });
        }
        setCurrSpin(response.data);
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
  }, [isSpinning, userStats, Bet, settings.sound, user]);

  useEffect(() => {
    let active = true;
    getBets()
      .then((response) => {
        if (
          active &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setBets(response.data);
          settBet(response.data[0]);
        } else if (active) {
          console.warn("無法取得預設投注金額列表");
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

  const handlePrevBet = useCallback(() => {
    const currentIndex = bets.indexOf(Bet);
    const newIndex = (currentIndex - 1 + bets.length) % bets.length;
    settBet(bets[newIndex]);
  }, [bets, Bet]);

  const handleNextBet = useCallback(() => {
    const currentIndex = bets.indexOf(Bet);
    const newIndex = (currentIndex + 1) % bets.length;
    settBet(bets[newIndex]);
  }, [bets, Bet]);

  const buttonDisabled = useMemo(() => {
    return (
      isSpinning ||
      (!!user && (Bet === 0 || !userStats || userStats.user_coins < Bet))
    );
  }, [isSpinning, user, Bet, userStats]);

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
            <div
              className={cn(
                "card secondary flex flex-col items-center justify-center transition-all",
                "p-4 gap-2",
                "col-span-1",
              )}
            >
              <span className={cn("font-bold text-(--muted)", "text-sm")}>
                投注金額
              </span>
              <div className="flex items-center justify-between w-full gap-2">
                <button onClick={handlePrevBet} disabled={bets.length <= 1}>
                  <CaretLeftOutlined className="text-2xl" />
                </button>

                <GlowText
                  className={cn(
                    "font-bold transition-all duration-300",
                    "text-2xl font-black flex-1 text-center",
                  )}
                >
                  {Bet}
                </GlowText>

                <button onClick={handleNextBet} disabled={bets.length <= 1}>
                  <CaretRightOutlined className="text-2xl" />
                </button>
              </div>
            </div>
            <div
              className={cn(
                "card secondary flex flex-col items-center justify-center transition-all",
                "p-4 gap-2",
                "col-span-1",
              )}
            >
              <span className={cn("font-bold text-(--muted)", "text-sm")}>
                持有金額
              </span>
              <GlowText
                className={cn(
                  "font-bold transition-all duration-300",
                  "text-xl",
                )}
              >
                {userStats?.user_coins.toLocaleString() ?? 0}
              </GlowText>
            </div>
            {/** 獎金顯示區 */}
            <div
              className={cn(
                "card secondary transition-all",
                "p-5 md:p-6",
                "col-span-2",
              )}
            >
              <div className="w-full flex items-center gap-4">
                <div className="flex-1">
                  <span className="text-xs text-(--muted)">本次獎金</span>
                  <div className="mt-2 flex items-baseline gap-3">
                    <GlowText
                      className={cn(
                        "font-black transition-all duration-300 tabular-nums",
                        "text-4xl md:text-5xl",
                      )}
                    >
                      {currSpin ? currSpin.reward : "-"}
                    </GlowText>
                  </div>
                </div>

                <div className="flex flex-col gap-1 justify-center">
                  {[
                    {
                      label: "倍率",
                      value:
                        currSpin && currSpin?.multiplier !== null
                          ? `${currSpin.multiplier.toFixed(4)}x`
                          : "-",
                    },
                    { label: "投注", value: currSpin ? currSpin.bet : "-" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="text-xs text-(--muted)">
                        {item.label}:
                      </span>

                      <div className="rounded-full bg-black/20 text-(--primary) font-bold text-sm flex items-center justify-center">
                        <GlowText className="text-sm tabular-nums">
                          {item.value}
                        </GlowText>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
            {isSpinning ? "轉動中..." : "轉動"}
          </button>
        </aside>
      </div>
      <MusicAudio loop preload="auto" />
    </section>
  );
};
