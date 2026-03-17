"use client";

import { AuthButton } from "@/components/AuthButton";
import { GlowText } from "@/components/GlowText";
import { SignBy } from "@/types/backend";
import { GoogleOutlined } from "@ant-design/icons";

const SIGN_BY_OPTIONS: {
  icon: React.ComponentType<{ className?: string }>;
  by: SignBy;
}[] = [
  {
    icon: GoogleOutlined,
    by: "google",
  },
];

export const MainSection = () => {
  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center px-4">
        <div className="card rounded-2xl p-6 md:p-10 text-center w-full max-w-lg flex flex-col items-center justify-center gap-4">
          <GlowText className="text-2xl md:text-4xl font-bold tracking-widest">
            歡迎回來
          </GlowText>
          <p className="text-(--muted) text-sm md:text-base">
            請選擇以下方式登入以繼續遊戲
          </p>
          <div className="flex flex-col gap-4 w-full">
            {SIGN_BY_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <AuthButton
                  key={option.by}
                  type="login"
                  signBy={option.by}
                  className="capitalize w-full  btn primary  flex items-center justify-center p-3 sm:text-lg gap-2 rounded-xl"
                >
                  <Icon className="text-xl" />
                  {option.by}
                </AuthButton>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
