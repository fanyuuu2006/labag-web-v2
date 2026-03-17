"use client";

import { AuthButton } from "@/components/AuthButton";
import { GlowText } from "@/components/GlowText";
import { SIGN_BY } from "@/libs/backend";
import { SignBy } from "@/types/backend";
import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";

const SIGN_BY_COMPONENTS_MAP: Record<
  SignBy,
  {
    icon: React.ComponentType<{
      className?: string;
    }>;
  }
> = {
  google: { icon: GoogleOutlined },
  github: { icon: GithubOutlined },
};
export const MainSection = () => {
  return (
    <section className="h-full">
      <div className="container h-full flex flex-col items-center justify-center">
        <div className="card rounded-2xl p-8 text-center w-full max-w-lg flex flex-col items-center justify-center gap-4 shadow-xl">
          <GlowText
            as={"h2"}
            className="text-3xl md:text-4xl font-bold tracking-widest"
          >
            歡迎回來
          </GlowText>
          <p className="text-(--muted) text-sm md:text-base">
            請選擇以下方式登入以繼續遊戲
          </p>
          <div className="flex flex-col gap-4 w-full">
            {SIGN_BY.map((by) => {
              const { icon: Icon } = SIGN_BY_COMPONENTS_MAP[by];
              return (
                <AuthButton
                  key={by}
                  type="login"
                  signBy={by}
                  className="capitalize w-full btn primary flex items-center justify-center p-3 text-xl gap-3 rounded-xl"
                >
                  <Icon className="text-[1.25em]" />
                  <span className="font-bold">{by}</span>
                </AuthButton>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
