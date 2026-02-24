"use client";
import { GlowText } from "@/components/GlowText";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useModal } from "@/hooks/useModal";
import {
  CloseOutlined,
  CustomerServiceOutlined,
  SoundOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { createContext, useContext, useState, useMemo } from "react";
import { useUserModal } from "./UserModalContext";
import { useUser } from "./UserContext";
import { AuthButton } from "@/components/AuthButton";
import { cn } from "@/utils/className";

type SettingOption<T> = {
  value: T;
  set: React.Dispatch<React.SetStateAction<T>>;
};

interface SettingContextType {
  modal: ReturnType<typeof useModal>;
  music: SettingOption<boolean>;
  sound: SettingOption<boolean>;
}

const settingContext = createContext<SettingContextType | null>(null);

const SettingItem = ({
  id,
  label,
  icon: Icon,
  value,
  setValue,
}: {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="flex items-center justify-between p-2">
    <div className="flex items-center gap-3">
      {Icon && <Icon className="text-xl" />}
      <label
        htmlFor={id}
        className="font-medium cursor-pointer select-none text-xl"
      >
        {label}
      </label>
    </div>
    <ToggleSwitch id={id} value={value} setValue={setValue} />
  </div>
);

export const SettingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const modal = useModal({});
  const [music, setMusic] = useState<boolean>(true);
  const [sound, setSound] = useState<boolean>(true);
  const userModal = useUserModal();
  const { user } = useUser();
  const value = useMemo(
    () => ({
      modal,
      music: {
        value: music,
        set: setMusic,
      },
      sound: {
        value: sound,
        set: setSound,
      },
    }),
    [modal, music, sound]
  );
  return (
    <settingContext.Provider value={value}>
      {children}
      <modal.Container className="bg-black/40 flex items-center justify-center p-6 z-50">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="setting-title"
          aria-describedby="setting-desc"
          className="animate-pop card w-full max-w-md sm:max-w-lg p-5 sm:p-6 flex flex-col gap-6"
        >
          <div
            id="setting-header"
            className="flex items-center justify-between"
          >
            <GlowText
              as="h4"
              id="setting-title"
              className="text-2xl sm:text-3xl font-extrabold"
            >
              遊戲設定
            </GlowText>
            <button
              id="settings-close"
              onClick={modal.close}
              className="text-(--muted) hover:text-white transition-colors"
              aria-label="關閉設定選單"
              title="關閉設定"
            >
              <CloseOutlined className="text-xl" />
            </button>
          </div>

          <p id="setting-desc" className="sr-only">
            此選單可切換遊戲設定與管理帳號。
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <SettingItem
                id="music"
                label="背景音樂"
                icon={CustomerServiceOutlined}
                value={music}
                setValue={setMusic}
              />
              <SettingItem
                id="sound"
                label="遊戲音效"
                icon={SoundOutlined}
                value={sound}
                setValue={setSound}
              />
            </div>

            {/*此為分隔線 */}
            <div className="border-t-2 border-(--secondary)/30 w-full" />

            <div className="flex flex-col gap-3">
              {user && (
                <button
                  className="flex items-center justify-center gap-2 btn secondary w-full rounded-xl py-2 font-medium"
                  onClick={() => userModal.open(user.id)}
                >
                  <UserOutlined />
                  開啟個人檔案
                </button>
              )}
              <div className="flex items-center justify-center">
                <AuthButton
                  className={cn(
                    "w-full btn rounded-xl py-2 font-semibold transition-all",
                    {
                      "primary": !user,
                      "bg-red-600 text-white": !!user,
                    }
                  )}
                />
              </div>
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
