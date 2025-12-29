"use client";
import { createContext, useContext, useState, useMemo } from "react";

type SettingOption<T> = {
  value: T;
  set: React.Dispatch<React.SetStateAction<T>>;
};

interface SettingContextType {
  music: SettingOption<boolean>;
}

const settingContext = createContext<SettingContextType | null>(null);

export const SettingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [music, setMusic] = useState<boolean>(true);
  const value = useMemo(
    () => ({
      music: {
        value: music,
        set: setMusic,
      },
    }),
    [music]
  );
  return (
    <settingContext.Provider value={value}>{children}</settingContext.Provider>
  );
};

export const useSetting = () => {
  const context = useContext(settingContext);
  if (!context) {
    throw new Error("useSetting 必須在 SettingProvider 內使用");
  }
  return context;
};
