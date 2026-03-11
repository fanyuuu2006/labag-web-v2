"use client";

import { Pattern } from "labag";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { MyImage } from "@/components/MyImage";
import { cn } from "@/utils/className";
import { useModeModal } from "@/contexts/ModeModalContext";
import { useCallback } from "react";
import { modeDescriptions } from "@/libs/game";

export const PatternCard = ({ pattern }: { pattern: Pattern }) => {
  
  const pm = usePatternModal();
  const mm = useModeModal();
  const isTheme = pattern.name in modeDescriptions;

  const handleClick = useCallback(() => {
    if (isTheme) {
      mm.open(pattern.name as keyof typeof modeDescriptions);
    } else {
      pm.open(pattern);
    }
  }, [isTheme, mm, pattern, pm]);

  return (
    <button
      data-theme={isTheme ? pattern.name : "normal"}
      onClick={handleClick}
      className={cn(
        "btn secondary flex flex-col items-center h-full w-full p-3 rounded-xl",
      )}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
        <MyImage
          src={`/images/patterns/${pattern.name}.jpg`}
          alt={pattern.name}
          className="w-full h-full object-cover"
        />
      </div>

      <span className="font-bold text-lg capitalize">{pattern.name}</span>
    </button>
  );
};
