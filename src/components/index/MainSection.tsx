"use client";

import { game } from "@/libs/game";
import { site } from "@/libs/site";
import Link from "next/link";
import { GlowText } from "../GlowText";
import { MyImage } from "../MyImage";
import { useUser } from "@/contexts/UserContext";
import { useUserModal } from "@/contexts/UserModalContext";
import { AuthButton } from "../AuthButton";

export const MainSection = () => {
  const { user, loading } = useUser();
  const modal = useUserModal();

  return (
    <section className="h-full">
      <div className="container h-full px-4 flex flex-col items-center justify-center text-center gap-4">
        <GlowText
          as="h2"
          className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight tracking-tight"
        >
          {site.title}
        </GlowText>
        <p className="text-base sm:text-xl md:text-2xl text-(--muted) max-w-xl md:max-w-2xl leading-relaxed">
          {site.description}
        </p>

        <div className="flex gap-4 sm:gap-6 mt-6 justify-center items-center">
          <Link
            href={"/game"}
            className="btn primary font-bold px-8 py-4 text-xl sm:text-2xl rounded-full text-center"
            onClick={() => {
              game.init();
            }}
          >
            開始遊戲
          </Link>
          <Link
            href={"/rankings"}
            className="btn secondary font-bold px-8 py-4 text-xl sm:text-2xl rounded-full text-center"
          >
            排行榜
          </Link>
        </div>
      </div>

      {/* 使用者登入資訊 */}
      {!loading && (
        <div className="fixed bottom-6 left-6 z-40">
          <div className="card primary text-sm md:text-base flex items-center gap-3 px-4 py-2 rounded-full">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MyImage
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 sm:h-9 aspect-square rounded-full object-cover"
                  />
                </div>

                <div className="flex flex-col items-start leading-tight">
                  <span className="text-(--muted) text-xs">歡迎回來</span>
                  <button
                    className="font-medium text-(--primary) hover:underline"
                    onClick={() => modal.open(user.id)}
                    aria-label={`打開使用者 ${user.name} 的資訊`}
                  >
                    {user.name}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-(--muted)">尚未登入?</span>
                <AuthButton className="font-medium text-(--primary)">
                  立即登入
                </AuthButton>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
