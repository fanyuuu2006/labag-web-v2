"use client";
import { useModal } from "@/hooks/useModal";
import {
  CloseOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { createContext, useContext, useMemo, memo } from "react";
import { useUserModal } from "./UserModalContext";
import { useUser } from "./UserContext";
import { AuthButton } from "@/components/AuthButton";
import { cn } from "@/utils/className";
import {
  SETTINGS_CONFIG,
  SettingKey,
  Settings,
  useSetting,
} from "./SettingContext";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { Selector } from "@/components/Selector";
import { GlowText } from "@/components/GlowText";

type SettingModalContextType = Omit<ReturnType<typeof useModal>, "Container">;
const SettingModalContext = createContext<SettingModalContextType | null>(null);

const SettingItem = memo(
  ({
    config,
    value,
    setValue,
  }: {
    config: (typeof SETTINGS_CONFIG)[number];
    value: Settings[SettingKey];
    setValue: React.Dispatch<React.SetStateAction<Settings[SettingKey]>>;
  }) => {
    const renderInput = () => {
      switch (config.type) {
        case "boolean":
          return (
            <ToggleSwitch
              className="text-2xl"
              id={config.key}
              value={value as boolean}
              setValue={
                setValue as React.Dispatch<React.SetStateAction<boolean>>
              }
            />
          );
        case "select":
          return (
            <Selector
              id={config.key}
              options={config.options.map((option) => ({
                label: option,
                value: option,
              }))}
              value={String(value)}
              onChange={(e) =>
                setValue(e.target.value as (typeof config.options)[number])
              }
            />
          );
        default:
          return null;
      }
    };

    const input = renderInput();
    if (!input) return null;

    return (
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-3">
          <config.icon className="text-xl" />
          <label
            htmlFor={config.key}
            className="font-medium cursor-pointer select-none text-xl"
          >
            {config.label}
          </label>
        </div>
        {input}
      </div>
    );
  },
);

SettingItem.displayName = "SettingItem";

export const SettingModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { Container, open, close, isOpen } = useModal({});
  const { settings, setSetting } = useSetting();
  const userModal = useUserModal();
  const { user, loading } = useUser();

  const value = useMemo(
    () => ({
      open,
      close,
      isOpen,
    }),
    [open, close, isOpen],
  );

  return (
    <SettingModalContext.Provider value={value}>
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
              onClick={close}
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
                  config={config}
                  value={settings[config.key]}
                  setValue={(val) => setSetting(config.key, val)}
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
    </SettingModalContext.Provider>
  );
};

export const useSettingModal = () => {
  const context = useContext(SettingModalContext);
  if (!context) {
    throw new Error("useSettingModal 必須在 SettingModalProvider 內使用");
  }
  return context;
};
