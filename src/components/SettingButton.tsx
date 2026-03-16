"use client";
import { useSettingModal } from "@/contexts/SettingModalContext";
import { useUser } from "@/contexts/UserContext";
import { SettingOutlined } from "@ant-design/icons";
import { MyImage } from "./MyImage";
import { cn } from "@/utils/className";

type SettingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SettingButton = ({ className, ...rest }: SettingButtonProps) => {
  const modal = useSettingModal();
  const { user, loading } = useUser();

  if (loading) return null;

  return (
    <button
      onClick={modal.open}
      accessKey="s"
      className={cn(
        "btn secondary flex items-center justify-center p-2 rounded-full text-2xl",
        className,
      )}
      aria-label="打開設定 (Alt + S)"
      title="設定 (Alt + S)"
      {...rest}
    >
      {!user ? (
        <SettingOutlined />
      ) : (
        <MyImage
          src={user.avatar}
          fallbackSrc={`/default-avatar.jpg`}
          alt={`${user.name} 的頭像`}
          title={`${user.name} 的頭像`}
          className="w-[1em] object-cover rounded-full border border-(--secondary)"
        />
      )}
    </button>
  );
};
