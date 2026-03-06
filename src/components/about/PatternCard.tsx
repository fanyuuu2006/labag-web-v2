"use client";

import { Pattern } from "labag";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { MyImage } from "@/components/MyImage";

export const PatternCard = ({ pattern }: { pattern: Pattern }) => {
  const modal = usePatternModal();
  return (
    <button
      onClick={() => modal.open(pattern)}
      className="btn secondary p-3 sm:p-4 h-full flex flex-col items-center gap-3 rounded-xl"
    >
      <div className="w-full aspect-square rounded-lg overflow-hidden relative">
        <MyImage
          src={`/images/patterns/${pattern.name}.jpg`}
          alt={pattern.name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="font-bold text-sm sm:text-base">{pattern.name}</span>
    </button>
  );
};
