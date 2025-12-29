"use client";
import { GlowText } from "@/components/GlowText";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useModal } from "@/hooks/useModal";
import { createContext, useContext, useState, useMemo } from "react";

type SettingOption<T> = {
  value: T;
  set: React.Dispatch<React.SetStateAction<T>>;
};

interface SettingContextType {
  modal: ReturnType<typeof useModal>;
  music: SettingOption<boolean>;
}

const settingContext = createContext<SettingContextType | null>(null);

export const SettingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const modal = useModal({});
  const [music, setMusic] = useState<boolean>(true);
  const value = useMemo(
    () => ({
      modal,
      music: {
        value: music,
        set: setMusic,
      },
    }),
    [modal, music]
  );
  return (
    <settingContext.Provider value={value}>
      {children}
      <modal.Container className="bg-black/40 flex items-center justify-center p-6 z-50">
        <div
          aria-label="設定選單"
          className="card w-full max-w-md sm:max-w-lg p-5 sm:p-6 flex flex-col gap-4"
        >
          <GlowText as="h4" className="text-2xl sm:text-3xl font-extrabold mb-2">
            設定
          </GlowText>
          <div className="flex flex-col gap-3 text-lg md:text-xl">
            <div className="flex items-center justify-between">
              <span className="font-medium text-neutral-200">背景音樂</span>
              <ToggleSwitch id="music" value={music} setValue={setMusic} />
            </div>
          </div>
        </div>
      </modal.Container>
    </settingContext.Provider>
  );
};

export const useSetting = () => {
  const context = useContext(settingContext);
  if (!context) {
    throw new Error("useSetting 必須在 SettingProvider 內使用");
  }
  return context;
};
