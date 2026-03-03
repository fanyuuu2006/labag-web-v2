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
        "card primary text-base flex items-center gap-2 px-2 py-1 rounded-full",
        className,
      )}
      {...rest}
    >
      {user ? (
        <button
          className="flex items-center gap-2 p-1"
          onClick={() => userModal.open(user.id)}
        >
          <span className="flex relative rounded-full">
            <MyImage
              src={user.avatar}
              alt={user.name}
              className="h-10 aspect-square rounded-full object-cover"
            />
          </span>

          <div className="flex flex-col items-start leading-tight">
            <span className="text-(--muted) text-xs">歡迎回來</span>
            <span className="font-medium text-(--primary) text-left">
              {user.name}
            </span>
          </div>
        </button>
      ) : (
        <div className="flex items-center gap-3 pl-4">
          <span className="text-(--muted) whitespace-nowrap">尚未登入?</span>
          <AuthButton className="font-medium text-(--primary) whitespace-nowrap">
            立即登入
          </AuthButton>
        </div>
      )}
      {/* 分隔線 */}
      <div className="border-l-2 border-(--border) h-8" />

        <button
          onClick={modal.open}
          className="btn rounded-full flex items-center justify-center p-2.5 sm:p-3 hover:rotate-90 text-xl md:text-2xl lg:text-3xl"
          aria-label="打開設定"
        >
          <SettingOutlined />
        </button>
    </div>
  );
};
