import { useCallback, useState } from "react";
import { useModal } from "./useModal";
import { ModeName } from "labag";
import { GlowText } from "@/components/GlowText";
import { DetailItem } from "@/components/DetailItem";
import { description } from "@/libs/game";

export const useModeModal = () => {
  const [mode, setMode] = useState<ModeName | null>(null);
  const modal = useModal({});
  const open = useCallback(
    (m: ModeName) => {
      setMode(m);
      modal.open();
    },
    [modal]
  );

  const Content = mode && (
    <div className="w-full max-w-xs sm:max-w-md md:max-w-lg card flex flex-col items-center p-4 sm:p-6 gap-4 animate-pop">
      <GlowText
        as="h3"
        className="text-2xl sm:text-3xl font-extrabold underline-spread text-(--text-color-primary)"
      >
        {description[mode].name}
      </GlowText>

      <div className="p-2">
        {description[mode].details.map((detail, index) => (
          <DetailItem key={index} detail={detail} />
        ))}
      </div>

      <div className="flex w-full justify-center sm:justify-end">
        <button
          className="btn-tertiary px-4 py-2 rounded-full w-full sm:w-auto"
          onClick={() => modal.close()}
        >
          我知道了
        </button>
      </div>
    </div>
  );

  return { ...modal, open, Content };
};
