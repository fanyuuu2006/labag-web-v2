"use client";
import { useModal } from "@/hooks/useModal";
import { Pattern } from "labag";
import { createContext, useContext, useState, useMemo } from "react";
import { OverrideProps } from "fanyucomponents";
import { getPatternInfo } from "@/utils/game";
import { GlowText } from "@/components/GlowText";
import { MyImage } from "@/components/MyImage";

type PatternModalContextType = OverrideProps<
  ReturnType<typeof useModal>,
  {
    open: (pattern: Pattern) => void;
  }
>;

const PatternModalContext = createContext<PatternModalContextType | null>(null);

export const PatternModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const modal = useModal({});
  const { name, scores, rate } = useMemo(
    () => pattern ? getPatternInfo(pattern) : { name: "", scores: [0, 0, 0], rate: 0 },
    [pattern]
  );
  const displayRate = Number(Number(rate).toFixed(1));
  const value = useMemo(
    () => ({
      ...modal,
      open: (p: Pattern) => {
        modal.open();
        setPattern(p);
      },
    }),
    [modal]
  );

  return (
    <PatternModalContext.Provider value={value}>
      {children}
      <modal.Container className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
        {pattern && (
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl card p-6 flex flex-col gap-2  animate-pop">
            <div className="flex flex-col sm:flex-row w-full gap-4 items-center">
              {/**左側 */}
              <div className="w-1/3 flex flex-col items-center gap-3">
                <div className="w-full aspect-square rounded-md overflow-hidden">
                  <MyImage
                    src={`/images/patterns/${name}.jpg`}
                    alt={name}
                    className="w-full h-full object-cover scale-105"
                  />
                </div>
                {/**名稱 */}
                <GlowText
                  as="h2"
                  className="text-xl md:text-2xl lg:text-3xl font-extrabold"
                >
                  {name}
                </GlowText>
              </div>

              {/**右側 */}
              <div className="flex-1 w-full">
                <div className="w-full flex flex-col gap-3">
                  {/**機率進度條 */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">當前出現機率</div>
                      <div className="text-sm font-bold text-(--text-color-primary)">
                        {displayRate}%
                      </div>
                    </div>

                    <div
                      className="w-full h-2 bg-black/40 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={displayRate}
                      title={`出現機率 ${displayRate}%`}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(0, Math.min(100, displayRate))}%`,
                          background: `linear-gradient(90deg, var(--text-color-primary), var(--text-color-secondary))`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-(--text-color-muted)">
                      得分 (計分方式請見普通模式說明)
                    </span>
                    <div className="text-sm flex flex-col gap-1">
                      {[
                        {
                          label: "三個相同",
                          score: scores[0],
                        },
                        {
                          label: "兩個相同",
                          score: scores[1],
                        },
                        {
                          label: "皆不同",
                          score: scores[2],
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-black/20 rounded-full px-4 py-1"
                        >
                          <div>{item.label}</div>
                          <div className="text-[1.2em] font-bold">
                            {item.score}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center sm:justify-end">
                    <button
                      onClick={modal.close}
                      className="btn-secondary rounded-full px-4 py-2"
                    >
                      我知道了
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </modal.Container>
    </PatternModalContext.Provider>
  );
};

export const usePatternModal = () => {
  const context = useContext(PatternModalContext);
  if (!context) {
    throw new Error("usePatternModal 必須在 PatternModalProvider 內使用");
  }
  return context;
};
