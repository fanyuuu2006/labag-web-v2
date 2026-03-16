"use client";
import { useModal } from "@/hooks/useModal";
import { Pattern } from "labag";
import { createContext, useContext, useState, useMemo } from "react";
import { OverrideProps } from "fanyucomponents";
import { GlowText } from "@/components/GlowText";
import { MyImage } from "@/components/MyImage";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
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
    return Math.max(0, Math.min(100, Number((info.probability * 100).toFixed(1))));
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
        {!info ? (
          <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
            <LoadingOutlined className="text-5xl" />
            <GlowText className="text-xl font-bold tracking-widest">載入中...</GlowText>
          </div>
        ) : (
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl card rounded-2xl p-4 md:p-6 flex flex-col gap-4 animate-pop max-h-[85vh] overflow-y-auto">
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

            <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-6">
              {/**左側 Image */}
              <div className="w-24 sm:w-1/3 flex flex-col items-center gap-2 sm:gap-3 shrink-0 mx-auto sm:mx-0">
                <div className="card primary w-full aspect-square rounded-xl overflow-hidden border-2 border-(--secondary)">
                  <MyImage
                    src={info.image}
                    alt={info.id}
                    className="w-full h-full object-cover"
                  />
                </div>
                <GlowText
                  as="h2"
                  className="text-lg sm:text-2xl md:text-3xl font-black text-center capitalize"
                >
                  ID: {info.id}
                </GlowText>
              </div>

              {/**右側 Info */}
              <div className="flex-1 w-full flex flex-col gap-2 sm:gap-3">
                {/**機率進度條 */}
                <div className="p-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-(--muted)">
                      當前出現機率
                    </span>
                    <GlowText className="text-base sm:text-lg font-bold">
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
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-bold text-(--muted)">
                      獎勵列表
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {info.payouts.map((item, index) => (
                      <div
                        key={index}
                        className="card primary flex items-center justify-between px-3 py-1 sm:px-4 sm:py-2 rounded-lg group hover:brightness-110 transition-all"
                      >
                        <span className="text-sm sm:text-base font-medium text-white/80">
                          {item.match_count} 個相同
                        </span>
                        <div className="flex items-baseline gap-1">
                          <GlowText className="text-lg sm:text-xl font-black tabular-nums">
                            {item.reward}
                          </GlowText>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
