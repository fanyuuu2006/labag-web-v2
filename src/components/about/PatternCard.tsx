"use client";

import { modes, Pattern } from "labag";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { MyImage } from "@/components/MyImage";
import { cn } from "@/utils/className";

export const PatternCard = ({ pattern }: { pattern: Pattern }) => {
  const modal = usePatternModal();
  const isTheme = modes.some((m) => m.variable.pattern === pattern);

  return (
    <button
      data-theme={isTheme ? pattern.name : 'normal'}
      onClick={() => modal.open(pattern)}
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

      <span className="font-bold text-lg capitalize">
        {pattern.name}
      </span>
    </button>
  );
};
