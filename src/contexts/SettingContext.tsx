"use client";
import { GlowText } from "@/components/GlowText";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { useModal } from "@/hooks/useModal";
import {
  CloseOutlined,
  CustomerServiceOutlined,
  LoadingOutlined,
  SoundOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useUserModal } from "./UserModalContext";
import { useUser } from "./UserContext";
import { AuthButton } from "@/components/AuthButton";
import { cn } from "@/utils/className";


// 這裡可以輕鬆擴充新的設定選項，設定的key與localStorage儲存的key相關
const SETTINGS_CONFIG = [
  {
    key: "music",
    label: "背景音樂",
    icon: CustomerServiceOutlined,
    defaultValue: true,
  },
  {
    key: "sound",
    label: "遊戲音效",
    icon: SoundOutlined,
    defaultValue: true,
  },
] as const;

export type SettingKey = (typeof SETTINGS_CONFIG)[number]["key"];

export type Settings = Record<SettingKey, boolean>;

interface SettingContextType {
  modal: Omit<ReturnType<typeof useModal>, "Container">;
  settings: Settings;
  setSetting: (key: SettingKey, value: React.SetStateAction<boolean>) => void;
}

const settingContext = createContext<SettingContextType | null>(null);

const STORAGE_KEY_PREFIX = "labag-settings-";

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
    <ToggleSwitch
      className="text-2xl"
      id={id}
      value={value}
      setValue={setValue}
    />
  </div>
);

export const SettingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { Container, ...modal } = useModal({});
  
  const [settings, setSettings] = useState<Settings>(() => {
    return SETTINGS_CONFIG.reduce((acc, config) => {
      acc[config.key] = config.defaultValue;
      return acc;
    }, {} as Settings);
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // 載入設定值，僅在初始時執行一次
  useEffect(() => {
    const newSettings = { ...settings };
    let hasChanges = false;

    SETTINGS_CONFIG.forEach((config) => {
      const storedValue = localStorage.getItem(STORAGE_KEY_PREFIX + config.key);
      if (storedValue !== null) {
        newSettings[config.key] = storedValue === "true";
        hasChanges = true;
      }
    });

    if (hasChanges) {
        setSettings(newSettings);
    }
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    
    SETTINGS_CONFIG.forEach((config) => {
       localStorage.setItem(STORAGE_KEY_PREFIX + config.key, String(settings[config.key]));
    });
  }, [settings, isLoaded]);

  const updateSetting = (key: SettingKey, value: React.SetStateAction<boolean>) => {
    setSettings((prev) => {
        const currentVal = prev[key];
        const nextVal = typeof value === 'function' ? (value as (prev: boolean) => boolean)(currentVal) : value;
        return { ...prev, [key]: nextVal };
    });
  };

  const userModal = useUserModal();
  const { user, loading } = useUser();
  
  const value = useMemo(
    () => ({
      modal,
      settings,
      setSetting: updateSetting,
    }),
    [modal, settings],
  );

  return (
    <settingContext.Provider value={value}>
      {children}
      <Container className="bg-black/40 flex items-center justify-center p-4 z-50">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="setting-title"
          aria-describedby="setting-desc"
          className="animate-pop card rounded-2xl w-full max-w-md sm:max-w-lg p-5 sm:p-6 flex flex-col gap-6"
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
              {SETTINGS_CONFIG.map((config) => (
                <SettingItem
                  key={config.key}
                  id={config.key}
                  label={config.label}
                  icon={config.icon}
                  value={settings[config.key]}
                  setValue={(val) => updateSetting(config.key as SettingKey, val)}
                />
              ))}
            </div>

            {/*此為分隔線 */}
            <div className="border-t-2 border-(--secondary)/30 w-full" />
             
            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="flex justify-center p-4">
                  <LoadingOutlined className="text-4xl" />
                </div>
              ) : (
                <>
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
                          primary: !user,
                          "bg-red-500 text-white": !!user,
                        },
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
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
