"use client";
import { cn } from "@/utils/className";
import React, { useCallback, useEffect, useState } from "react";

/**
 * PWA 安裝提示事件接口
 * 基於實驗性 API: https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type InstallPWAButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const InstallPWAButton = ({
  className,
  children,
  onClick,
  ...rest
}: InstallPWAButtonProps) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault(); // 阻止默認行為，防止瀏覽器自動顯示安裝提示
      setDeferredPrompt(e as BeforeInstallPromptEvent); // 保存事件對象，以便稍後觸發安裝提示
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      // 如果外部有傳入 onClick，先執行
      onClick?.(event);
      if (!deferredPrompt) return;

      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          console.log("正在安裝 PWA...");
        } else {
          console.log("用戶拒絕安裝 PWA");
        }
      } catch (err) {
        console.error("PWA 安裝失敗:", err);
      } finally {
        // 無論結果如何，清除保存的事件（因為只能使用一次）
        setDeferredPrompt(null);
      }
    },
    [deferredPrompt, onClick],
  );

  if (!deferredPrompt) {
    return null; // 如果沒有安裝提示事件，則不顯示按鈕
  }

  return (
    <button
      type="button" // 預設為 button 類型，避免意外提交表單
      className={cn(className)}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
};
