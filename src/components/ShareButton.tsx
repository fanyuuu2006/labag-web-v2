"use client";
import { ACCESS_TOKEN_KEY } from "@/contexts/UserContext";
import { site } from "@/libs/site";
import { createShare } from "@/utils/backend";
import { DistributiveOmit } from "fanyucomponents";
import { useCallback, useState } from "react";

type ShareButtonProps = DistributiveOmit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
>;

export const ShareButton = ({ disabled, ...rest }: ShareButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      alert("請先登入");
      return;
    }

    setLoading(true);
    try {
      const { data } = await createShare(token);
      if (data) {
        const title = `快來試試手氣！🎰 ${site.title}`;
        const text = `${site.description}\n看看你能轉出什麼大獎！🔥`;
        const url = `${window.location.origin}/share/${data.id}`;

        if (navigator.share) {
          try {
            await navigator.share({
              title,
              text,
              url,
            });
          } catch (error) {
            if ((error as unknown as Error).name !== "AbortError") {
              console.error("分享錯誤:", error);
            }
          }
        } else {
          try {
            await navigator.clipboard.writeText(url);
            alert("已複製分享連結");
          } catch (err) {
            console.error("複製失敗", err);
            alert("複製失敗");
          }
        }
      }
    } catch (error) {
      console.error("分享錯誤:", error);
      alert("分享失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <button disabled={disabled || loading} {...rest} onClick={handleClick} />
  );
};
