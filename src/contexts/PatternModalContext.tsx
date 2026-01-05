"use client";
import { useModal } from "@/hooks/useModal";
import { Pattern } from "labag";
import { createContext, useContext, useState, useMemo } from "react";
import { OverrideProps } from "fanyucomponents";
import { getPatternInfo } from "@/utils/game";
import { GlowText } from "@/components/GlowText";
import { MyImage } from "@/components/MyImage";
import { CloseOutlined } from "@ant-design/icons";

type PatternModalContextType = OverrideProps<
  ReturnType<typeof useModal>,
  {
    open: (pattern: Pattern) => void;
  }
>;

const patternModalContext = createContext<PatternModalContextType | null>(null);

export const PatternModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const modal = useModal({});
  const [info, setInfo] = useState<ReturnType<typeof getPatternInfo> | null>(
    null
  );

  const displayRate = Number(Number(info?.rate ?? 0).toFixed(1));
  const value = useMemo(
    () => ({
      ...modal,
      open: (p: Pattern) => {
        setInfo(getPatternInfo(p));
        modal.open();
      },
    }),
    [modal]
  );

  return (
    <patternModalContext.Provider value={value}>
      {children}
      <modal.Container
        className="bg-black/40 flex items-center justify-center p-4 z-50"
        aria-labelledby="pattern-modal-title"
      >
        {info && (
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl card p-4 md:p-6 flex flex-col gap-4 animate-pop max-h-[85vh] overflow-y-auto">
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
                className="text-(--text-color-muted) hover:text-white transition-colors"
                onClick={modal.close}
              >
                <CloseOutlined className="text-xl" />
              </button>
            </header>

            <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-6">
              {/**左側 Image */}
              <div className="w-24 sm:w-1/3 flex flex-col items-center gap-2 sm:gap-3 shrink-0 mx-auto sm:mx-0">
                <div className="card-primary w-full aspect-square rounded-xl overflow-hidden border-2 border-(--text-color-secondary)">
                  <MyImage
                    src={`/images/patterns/${info.name}.jpg`}
                    alt={info.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <GlowText
                  as="h2"
                  className="text-lg sm:text-2xl md:text-3xl font-black text-center"
                >
                  {info.name}
                </GlowText>
              </div>

              {/**右側 Info */}
              <div className="flex-1 w-full flex flex-col gap-2 sm:gap-3">
                {/**機率進度條 */}
                <div className="card-primary p-3 sm:p-4 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-(--text-color-muted)">
                      當前出現機率
                    </span>
                    <GlowText className="text-base sm:text-lg font-bold">
                      {displayRate}%
                    </GlowText>
                  </div>

                  <div
                    className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={displayRate}
                    title={`出現機率 ${displayRate}%`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.max(0, Math.min(100, displayRate))}%`,
                        background: `linear-gradient(90deg, var(--text-color-primary), var(--text-color-secondary))`,
                      }}
                    />
                  </div>
                </div>

                {/* Scores */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-bold text-(--text-color-muted)">
                      得分規則
                    </span>
                    <span className="text-xs text-(--text-color-muted) opacity-70">
                      (普通模式)
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {[
                      {
                        label: "三個相同",
                        score: info.scores[0],
                      },
                      {
                        label: "兩個相同",
                        score: info.scores[1],
                      },
                      {
                        label: "皆不同",
                        score: info.scores[2],
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="card-primary flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 rounded-lg group hover:brightness-110 transition-all"
                      >
                        <span className="text-sm sm:text-base font-medium text-white/80">
                          {item.label}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <GlowText className="text-lg sm:text-xl font-black tabular-nums">
                            {item.score}
                          </GlowText>
                          <span className="text-[10px] sm:text-xs text-(--text-color-muted)">
                            分
                          </span>
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
