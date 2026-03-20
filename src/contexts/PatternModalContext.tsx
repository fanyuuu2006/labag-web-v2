"use client";
import { useModal } from "@/hooks/useModal";
import { Pattern } from "labag";
import { createContext, useContext, useState, useMemo } from "react";
import { OverrideProps } from "fanyucomponents";
import { GlowText } from "@/components/GlowText";
import { MyImage } from "@/components/MyImage";
import { CloseOutlined } from "@ant-design/icons";
import { patternById } from "@/utils/backend";

type PatternModalContextType = OverrideProps<
  ReturnType<typeof useModal>,
  {
    open: (id: Pattern["id"]) => void;
  }
>;

const patternModalContext = createContext<PatternModalContextType | null>(null);

export const PatternModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const modal = useModal({});
  const [info, setInfo] = useState<
    Awaited<ReturnType<typeof patternById>>["data"] | null
  >(null);

  // pattern 的機率是小數，轉換成保留一位小數 百分比顯示，並且限制在 0% - 100% 之間
  const displayProbability = useMemo(() => {
    if (!info) return 0;
    return Math.max(
      0,
      Math.min(100, Number((info.probability * 100).toFixed(1))),
    );
  }, [info]);

  const value = useMemo(
    () => ({
      ...modal,
      open: (id: Pattern["id"]) => {
        setInfo(null);
        modal.open();
        patternById(id).then(({ data }) => {
          if (data) {
            setInfo(data);
          }
        });
      },
    }),
    [modal],
  );

  return (
    <patternModalContext.Provider value={value}>
      {children}
      <modal.Container
        className="bg-black/40 flex items-center justify-center p-4 z-50"
        aria-labelledby="pattern-modal-title"
      >
        <div className="animate-pop card rounded-2xl w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <header className="flex items-center justify-between sticky top-0 z-10">
            <GlowText
              as="h2"
              id="pattern-modal-title"
              className="text-lg md:text-xl font-extrabold tracking-wider"
            >
              圖案資訊
            </GlowText>
            <button
              type="button"
              aria-label="關閉"
              className="text-(--muted) hover:text-white"
              onClick={modal.close}
            >
              <CloseOutlined className="text-xl" />
            </button>
          </header>

          {!info ? (
            <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-6 animate-pulse select-none">
              {/**左側 Image Skeleton */}
              <div className="w-24 sm:w-1/3 flex flex-col items-center gap-2 sm:gap-3 shrink-0 mx-auto sm:mx-0">
                <div className="w-full aspect-square rounded-xl bg-white/10" />
                <div className="h-8 w-24 bg-white/10 rounded" />
              </div>

              {/**右側 Info Skeleton */}
              <div className="flex-1 w-full flex flex-col gap-2 sm:gap-3">
                {/**機率進度條 Skeleton */}
                <div className="p-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-5 w-12 bg-white/10 rounded" />
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full" />
                </div>

                {/* Payouts Skeleton */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="h-5 w-20 bg-white/10 rounded" />
                  </div>
                  <div className="grid gap-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="card primary flex items-center justify-between px-4 py-2 rounded-lg"
                      >
                        <div className="h-5 w-16 bg-white/10 rounded" />
                        <div className="h-7 w-8 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-6">
              {/**左側 Image */}
              <div className="shrink-0 flex flex-col items-center gap-3 w-full sm:w-auto sm:pr-4">
                <div className="relative aspect-square w-28 md:w-36 rounded-xl overflow-hidden border-2 border-(--secondary)">
                  <MyImage
                    src={info.image}
                    alt={info.id}
                    className="w-full h-full object-cover"
                  />
                </div>
                <GlowText as="h3" className="text-base md:text-lg font-black">
                  ID: {info.id}
                </GlowText>
              </div>

              {/**右側 Info */}
              <div className="flex-1 w-full flex flex-col gap-2 sm:gap-3">
                {/**機率進度條 */}
                <div className="p-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-(--muted)">
                      當前出現機率
                    </span>
                    <GlowText className="text-base md:text-lg font-bold">
                      {displayProbability}%
                    </GlowText>
                  </div>

                  <div
                    className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={displayProbability}
                    title={`出現機率 ${displayProbability}%`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.max(0, Math.min(100, displayProbability))}%`,
                        background: `linear-gradient(90deg, var(--primary), var(--secondary))`,
                      }}
                    />
                  </div>
                </div>

                {/* Payouts */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center flex-wrap gap-1 px-1">
                      <span className="text-sm font-bold text-(--muted)">
                        獎金倍率
                      </span>
                      <span className="text-xs text-(--muted)">
                        (會隨機加入小幅變動，最終實際獎金金額以畫面為準)
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {info.payouts.map((item, index) => (
                        <div
                          key={index}
                          className="card primary rounded-2xl flex items-center justify-between px-4 py-3"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm sm:text-base font-medium">
                              {item.match_count} 個相同
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <GlowText className="text-lg sm:text-2xl font-black tabular-nums">
                              {item.multiplier}x
                            </GlowText>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </modal.Container>
    </patternModalContext.Provider>
  );
};

export const usePatternModal = () => {
  const context = useContext(patternModalContext);
  if (!context) {
    throw new Error("usePatternModal 必須在 PatternModalProvider 內使用");
  }
  return context;
};
