"use client";
import { ACCESS_TOKEN_KEY } from "@/contexts/UserContext";
import { site } from "@/libs/site";
import { createShare } from "@/utils/backend";
import { useCallback, useState } from "react";

type ShareButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ShareButton = ({
  onClick,
  disabled,
  ...rest
}: ShareButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      setLoading(true);
      try {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        let data;
        if (token) {
          const response = await createShare(token);
          data = response.data;
        }

        const url = data
          ? new URL(`/share/${data.id}`, window.location.origin).toString()
          : site.url.toString();

        const shareData = {
          title: `快來試試手氣！🎰 ${site.title}`,
          text: `${site.description}\n看看你能轉出什麼大獎！🔥`,
          url,
        };

        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare(shareData)
        ) {
          try {
            await navigator.share(shareData);
            return;
          } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
              return;
            }
            console.error("分享錯誤:", error);
          }
        }

        try {
          await navigator.clipboard.writeText(url);
          alert("已複製分享連結");
        } catch (err) {
          console.error("複製失敗", err);
          alert("複製失敗");
        }
      } catch (error) {
        console.error("分享錯誤:", error);
        alert("分享失敗");
      } finally {
        setLoading(false);
      }
      onClick?.(e);
    },
    [onClick],
  );

  return (
    <button disabled={disabled || loading} {...rest} onClick={handleClick} />
  );
};
