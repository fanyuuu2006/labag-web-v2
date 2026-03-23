"use client";
import { useCallback, useEffect, useState, memo, useMemo, useRef } from "react";
import { MyImage } from "../MyImage";
import { GlowText } from "../GlowText";
import { Pattern } from "labag";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { OverrideProps } from "fanyucomponents";
import { cn } from "@/utils/className";
import { patterns as fetchPatterns } from "@/utils/backend";

// 圖案快速切換的間隔時間（毫秒）
const INTERVAL_DURATION = 100;

// 模組級快取，避免重複向後端請求相同資料
let cachedPatterns: Pattern[] = [];

type PatternsDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    patterns: (Pattern | null)[];
    isSpinning: boolean;
  }
>;

export const PatternsDiv = ({
  patterns,
  className,
  isSpinning,
  ...rest
}: PatternsDivProps) => {
  // allPatterns 儲存目前可用的所有圖案，初始化為模組快取
  const [allPatterns, setAllPatterns] = useState<Pattern[]>(cachedPatterns);

  // 僅在元件 mount 時檢查快取並在必要時向後端請求。
  // 這避免依賴陣列中的陣列參考，減少不必要的 effect 重跑。
  useEffect(() => {
    if (cachedPatterns.length > 0) {
      // 若模組快取已有資料，改為使用 setTimeout 延遲設定 state，
      // 避免在 effect 內同步呼叫 setState 導致 cascading render 的 ESLint 警告。
      const t = setTimeout(() => setAllPatterns(cachedPatterns), 0);
      return () => clearTimeout(t);
    }

    let mounted = true;
    fetchPatterns().then(({ data }) => {
      if (!mounted) return;
      if (data) {
        cachedPatterns = data;
        setAllPatterns(data);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className={cn("mb-2 grid grid-cols-3 gap-1 relative", className)}
      {...rest}
    >
      <div className="absolute top-full left-1/2 -translate-x-1/2">
        <span className="text-xs md:text-sm text-(--muted)/30 text-nowrap">
          點擊查看圖案資訊
        </span>
      </div>
      {useMemo(
        () =>
          patterns.map((pattern, idx) => (
            <Slot
              key={idx}
              pattern={pattern}
              allPatterns={allPatterns}
              isSpinning={isSpinning}
            />
          )),
        // 只有當 patterns、allPatterns 或 isSpinning 改變時才重建 slot 元素
        [patterns, allPatterns, isSpinning],
      )}
    </div>
  );
};

type SlotProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    pattern: Pattern | null;
    allPatterns: Pattern[];
    isSpinning: boolean;
    children?: never;
  }
>;
const Slot = memo(
  ({ className, pattern, allPatterns, isSpinning, ...rest }: SlotProps) => {
    const pm = usePatternModal();

    // randomPattern: 當此 slot 在 "轉動" 時顯示的暫時圖案
    const [randomPattern, setRandomPattern] = useState<Pattern | null>(null);
    const isSlotSpinning = isSpinning && !pattern;

    // useRef 用來儲存 interval id，避免在 cleanup 時找不到 reference
    const intervalRef = useRef<number | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
      mountedRef.current = true;
      // 若不在轉動狀態或沒有圖案資料，確保清理並結束
      if (!isSlotSpinning || allPatterns.length === 0) {
        if (intervalRef.current != null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setTimeout(() => setRandomPattern(null), 0);
        return () => {
          mountedRef.current = false;
        };
      }

      // 若已有存在的 interval，先清掉再建立新的
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      intervalRef.current = window.setInterval(() => {
        // 先檢查元件是否仍存在，避免在 unmount 後 setState
        if (!mountedRef.current) return;
        const next =
          allPatterns[Math.floor(Math.random() * allPatterns.length)];
        setRandomPattern(next);
      }, INTERVAL_DURATION);

      return () => {
        mountedRef.current = false;
        if (intervalRef.current != null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // 延遲到微任務以避免在 effect cleanup 中同步 setState
        Promise.resolve().then(() => setRandomPattern(null));
      };
    }, [isSlotSpinning, allPatterns]);

    // 顯示圖案：若 slot 正在轉動，顯示隨機圖案，否則顯示傳入的固定圖案
    const displayPattern = isSlotSpinning ? randomPattern : pattern;

    // 點擊處理與鍵盤處理皆做 memoization，避免在每次渲染都建立新函式
    const handleClick = useCallback(() => {
      if (!pattern) return;
      pm.open(pattern.id);
    }, [pattern, pm]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick],
    );

    return (
      <div
        className={cn(
          "aspect-3/4 text-[7vh] font-bold card rounded-xl overflow-hidden",
          className,
        )}
        {...rest}
      >
        {displayPattern ? (
          <MyImage
            src={displayPattern.image}
            alt={`Pattern: ${displayPattern.id}`}
            className={cn(
              "w-full h-full object-cover scale-105 cursor-pointer",
              {
                "blur-xs": isSlotSpinning,
              },
            )}
            title={displayPattern.id}
            onClick={handleClick}
            role="button"
            aria-label={`開啟圖案 ${displayPattern.id} 詳情`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GlowText className="text-8xl">?</GlowText>
          </div>
        )}
      </div>
    );
  },
);
Slot.displayName = "Slot";
