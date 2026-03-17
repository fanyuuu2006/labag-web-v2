"use client";
import { useCallback, useEffect, useState } from "react";
import { MyImage } from "../MyImage";
import { GlowText } from "../GlowText";
import { Pattern } from "labag";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { OverrideProps } from "fanyucomponents";
import { cn } from "@/utils/className";
import { patterns as fetchPatterns } from "@/utils/backend";

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
  const [allPatterns, setAllPatterns] = useState<Pattern[]>([]);

  useEffect(() => {
    if (allPatterns.length === 0) {
      fetchPatterns().then(({ data }) => {
        if (data) {
          setAllPatterns(data);
        }
      });
    }
  }, [allPatterns.length]);

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
      {patterns.map((pattern, idx) => (
        <Slot
          key={idx}
          pattern={pattern}
          allPatterns={allPatterns}
          isSpinning={isSpinning}
        />
      ))}
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

const Slot = ({
  className,
  pattern,
  allPatterns,
  isSpinning,
  ...rest
}: SlotProps) => {
  const pm = usePatternModal();

  const handleClick = useCallback(() => {
    if (isSpinning || !pattern) return;
    pm.open(pattern.id);
  }, [isSpinning, pattern, pm]);

  return (
    <div
      className={cn(
        "aspect-3/4 text-[7vh] font-bold card rounded-xl overflow-hidden",
        className,
      )}
      {...rest}
    >
      {pattern ? (
        <MyImage
          src={pattern.image}
          alt={`Pattern: ${pattern.id}`}
          className="w-full h-full object-cover scale-105 cursor-pointer"
          title={pattern.id}
          onClick={handleClick}
          role="button"
          aria-label={`開啟圖案 ${pattern.id} 詳情`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleClick();
            }
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <GlowText className="text-8xl">?</GlowText>
        </div>
      )}
    </div>
  );
};
