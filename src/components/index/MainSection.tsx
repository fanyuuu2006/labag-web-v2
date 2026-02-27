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

        <div className="flex flex-co gap-4 sm:gap-6 mt-6 w-full justify-center items-center">
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

        {/* 使用者登入資訊 */}
        {!loading && (
          <div>
            <div className="card-secondary text-sm md:text-base flex items-center gap-3 px-4 py-2 rounded-full">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user.avatar ? (
                      <MyImage
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-1 ring-white/5"
                      />
                    ) : (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/5 text-(--muted) font-medium ring-1 ring-white/5">
                        {(user.name && user.name.charAt(0)) || "U"}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-(--primary) rounded-full ring-1 ring-white/30" />
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
                  <AuthButton className="font-medium text-(--primary)">立即登入</AuthButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
