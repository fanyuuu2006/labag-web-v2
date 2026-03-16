"use client";
import {
  CustomerServiceOutlined,
  SkinOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";

type SettingConfig = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
} & (
  | { type: "boolean"; options: readonly boolean[] }
  | { type: "select"; options: readonly string[] }
);

// 這裡可以輕鬆擴充新的設定選項，設定的key與localStorage儲存的key相關
export const SETTINGS_CONFIG = [
  {
    key: "music",
    label: "背景音樂",
    icon: CustomerServiceOutlined,
    type: "boolean",
    options: [true, false],
  },
  {
    key: "sound",
    label: "遊戲音效",
    icon: SoundOutlined,
    type: "boolean",
    options: [true, false],
  },
  {
    key: "theme",
    label: "主題",
    icon: SkinOutlined,
    type: "select",
    options: ["normal", "superhhh", "greenwei", "pikachu"],
  },
] as const satisfies readonly SettingConfig[];

export type SettingKey = (typeof SETTINGS_CONFIG)[number]["key"];

export type Settings = {
  [K in SettingKey]: Extract<
    (typeof SETTINGS_CONFIG)[number],
    { key: K }
  >["options"][number];
};

interface SettingContextType {
  settings: Settings;
  setSetting: <K extends SettingKey>(
    key: K,
    value: React.SetStateAction<Settings[K]>,
  ) => void;
}

const settingContext = createContext<SettingContextType | null>(null);

const STORAGE_KEY_PREFIX = "labag-settings-";

export const SettingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<Settings>(() => {
    return Object.fromEntries(
      SETTINGS_CONFIG.map((config) => [config.key, config.options[0]]),
    ) as Settings;
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // 載入設定值，僅在初始時執行一次
  useEffect(() => {
    const changes: Partial<Settings> = {};

    for (const config of SETTINGS_CONFIG) {
      const storedValue = localStorage.getItem(STORAGE_KEY_PREFIX + config.key);
      if (storedValue !== null) {
        switch (config.type) {
          case "boolean":
            changes[config.key] = storedValue === "true";
            break;
          case "select":
            if (
              config.options.includes(
                storedValue as (typeof config.options)[number],
              )
            ) {
              changes[config.key] =
                storedValue as (typeof config.options)[number];
            }
            break;
        }
      }
    }

    if (Object.keys(changes).length > 0) {
      setTimeout(() => setSettings((prev) => ({ ...prev, ...changes })), 0);
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    SETTINGS_CONFIG.forEach((config) => {
      localStorage.setItem(
        STORAGE_KEY_PREFIX + config.key,
        String(settings[config.key]),
      );
    });
  }, [settings, isLoaded]);

  const updateSetting = useCallback(
    <K extends SettingKey>(
      key: K,
      value: React.SetStateAction<Settings[K]>,
    ) => {
      setSettings((prev) => {
        const currentVal = prev[key];
        const nextVal =
          typeof value === "function"
            ? (value as (prev: Settings[K]) => Settings[K])(currentVal)
            : value;
        return { ...prev, [key]: nextVal };
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      settings,
      setSetting: updateSetting,
    }),
    [settings, updateSetting],
  );

  return (
    <settingContext.Provider value={value}>
      {children}
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
