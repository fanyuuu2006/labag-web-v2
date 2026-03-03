"use client";
import { useSetting } from "@/contexts/SettingContext";
import { useUser } from "@/contexts/UserContext";
import { useUserModal } from "@/contexts/UserModalContext";
import { cn } from "@/utils/className";
import { SettingOutlined } from "@ant-design/icons";
import { MyImage } from "./MyImage";
import { AuthButton } from "./AuthButton";

type SettingButtonProps = React.HTMLAttributes<HTMLDivElement>;

export const SettingButton = ({ className, ...rest }: SettingButtonProps) => {
  const { modal } = useSetting();
  const { user, loading } = useUser();
  const userModal = useUserModal();

  if (loading) return null;

  return (
    <div
      className={cn(
        "card primary text-base flex items-center gap-2 py-1 px-1.5 rounded-full",
        className,
      )}
      {...rest}
    >
      {user ? (
        <button
         aria-label="用戶資訊"
          className="flex items-center gap-3 px-1.5 py-1 rounded-full"
          onClick={() => userModal.open(user.id)}
        >
          <span className="flex relative rounded-full">
            <MyImage
              src={user.avatar}
              alt={user.name}
              className="h-10 aspect-square rounded-full object-cover"
            />
          </span>

          <div className="flex flex-col items-start leading-tight min-w-0 max-w-30 sm:max-w-37.5">
            <span className="text-(--muted) text-xs">歡迎回來</span>
            <span className="font-medium text-(--primary) text-left truncate w-full">
              {user.name}
            </span>
          </div>
        </button>
      ) : (
        <div className="flex items-center px-3">
          <AuthButton className="font-medium text-(--primary) whitespace-nowrap">
            立即登入
          </AuthButton>
        </div>
      )}

      {/* 分隔線 */}
      <div className="w-px h-8 bg-(--border)" />

      <button
        onClick={modal.open}
        accessKey='s'
        className="btn flex items-center justify-center p-2 rounded-full hover:rotate-90 text-xl"
        aria-label="打開設定"
      >
        <SettingOutlined />
      </button>
    </div>
  );
};
