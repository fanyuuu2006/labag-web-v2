"use client";
import { GlowText } from "@/components/GlowText";
import { useModal } from "@/hooks/useModal";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";
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
        <div className="card w-full max-w-md sm:max-w-lg p-6 flex flex-col gap-2 animate-pop">
          <GlowText
            as="h4"
            className="text-2xl sm:text-3xl font-extrabold mb-4"
          >
            設定
          </GlowText>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-(--text-color-primary)">
                背景音樂
              </span>
              <ToggleSwitch id="music" value={music} setValue={setMusic} />
            </div>
          </div>
        </div>
      </modal.Container>
    </settingContext.Provider>
  );
};

type ToggleSwitchProps = OverrideProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  {
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
  }
>;
const ToggleSwitch = ({
  className,
  id,
  setValue,
  value,
}: ToggleSwitchProps) => {
  return (
    <label htmlFor={id} className={cn(className)}>
      <input
        id={id}
        className="sr-only peer"
        type="checkbox"
        role="switch"
        aria-checked={value}
        checked={value}
        onChange={() => setValue((prev) => !prev)}
      />
      <div
        className={cn(
          "h-[1.2em] w-[2.5em] p-0.5 flex items-center rounded-full cursor-pointer",
          "justify-start peer-checked:justify-end",
          "transition-all duration-200",
          "bg-gray-300 peer-checked:bg-(--text-color-secondary)"
        )}
      >
        <span
          className={cn(
            "h-full w-auto aspect-square bg-white rounded-full",
            "transform transition-transform duration-200"
          )}
        />
      </div>
    </label>
  );
};

export const useSetting = () => {
  const context = useContext(settingContext);
  if (!context) {
    throw new Error("useSetting 必須在 SettingProvider 內使用");
  }
  return context;
};
