"use client";
import { useSetting } from "@/contexts/SettingContext";
import { cn } from "@/utils/className";
import { SettingOutlined } from "@ant-design/icons";

type SettingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export const SettingButton = ({ className, ...rest }: SettingButtonProps) => {
  const { modal } = useSetting();
  return (
    <button
      onClick={modal.open}
      className={cn(
        "btn tertiary rounded-full flex items-center justify-center p-3",
        className
      )}
      {...rest}
    >
      <SettingOutlined />
    </button>
  );
};
