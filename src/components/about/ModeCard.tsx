"use client";

import { useModeModal } from "@/contexts/ModeModalContext";
import { ModeName } from "labag";

export const ModeCard = ({
  modeKey,
  modeData,
}: {
  modeKey: ModeName;
  modeData: { name: string };
}) => {
  const modal = useModeModal();
  return (
    <button
      onClick={() => modal.open(modeKey)}
      className="btn secondary w-full py-8 text-xl sm:text-2xl font-bold rounded-2xl"
      data-theme={modeKey}
    >
      {modeData.name}
    </button>
  );
};
