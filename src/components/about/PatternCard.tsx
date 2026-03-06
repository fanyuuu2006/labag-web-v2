"use client";

import { modeList, Pattern } from "labag";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { MyImage } from "@/components/MyImage";
import { cn } from "@/utils/className";

export const PatternCard = ({ pattern }: { pattern: Pattern }) => {
  const modal = usePatternModal();
  const isTheme = modeList.some((m) => m.variable.pattern === pattern);

  return (
    <button
      data-theme={isTheme ? pattern.name : undefined}
      onClick={() => modal.open(pattern)}
      className={cn(
        "card group flex flex-col items-center h-full w-full p-2 sm:p-3 rounded-xl",
      )}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3">
        <MyImage
          src={`/images/patterns/${pattern.name}.jpg`}
          alt={pattern.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <span className="font-bold text-sm sm:text-base capitalize transition-colors group-hover:text-(--primary)">
        {pattern.name}
      </span>
    </button>
  );
};
