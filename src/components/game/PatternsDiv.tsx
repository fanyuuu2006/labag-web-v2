"use client";
import { useCallback } from "react";
import { MyImage } from "../MyImage";
import { GlowText } from "../GlowText";
import { Pattern } from "labag";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { OverrideProps } from "fanyucomponents";
import { cn } from "@/utils/className";

type PatternsDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    patterns: (Pattern | null)[];
  }
>;

export const PatternsDiv = ({
  patterns,
  className,
  ...rest
}: PatternsDivProps) => {
  const pm = usePatternModal();

  const handlePatternClick = useCallback(
    (pattern: Pattern) => {
      pm.open(pattern.id);
    },
    [pm],
  );

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
        <div
          key={idx}
          className="aspect-3/4 text-[7vh] font-bold card rounded-xl overflow-hidden"
        >
          {pattern ? (
            <MyImage
              src={pattern.image}
              alt={`Pattern ${idx + 1}: ${pattern.id}`}
              className="w-full h-full object-cover scale-105 cursor-pointer"
              title={pattern.id}
              onClick={() => handlePatternClick(pattern)}
              role="button"
              aria-label={`開啟圖案 ${pattern.id} 詳情`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handlePatternClick(pattern);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <GlowText className="text-8xl">?</GlowText>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
