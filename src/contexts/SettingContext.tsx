"use client";
import { useModal } from "fanyucomponents";
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
        <div className="card w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 flex flex-col gap-2 animate-pop"></div>
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
