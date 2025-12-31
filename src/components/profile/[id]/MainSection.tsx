"use client";

import { GlowText } from "@/components/GlowText";
import Link from "next/link";
import { MyImage } from "@/components/MyImage";
import { SupabaseAllowFieldsUser, SupabaseRecord } from "@/types/backend";

export const MainSection = ({
  user,
}: {
  user: SupabaseAllowFieldsUser | null;
  records: SupabaseRecord[];
}) => {
  return (
    <section className="h-full">
      <div className="container h-full">
        <div className="flex flex-col items-center justify-center h-full">
          {user ? (
            <>
              <div className="card w-full flex flex-col items-center p-4 md:p-6 gap-4">
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl w-full flex items-center gap-2">
                  <div className="card h-[4em] w-auto aspect-square rounded-full overflow-hidden">
                    <MyImage
                      src={user.avatar}
                      fallbackSrc={`/default-avatar.jpg`}
                      alt={`${user.name || "用戶"} 的頭像`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <GlowText as="h2" className="font-bold">
                      {user.name || "用戶"}
                    </GlowText>
                    <p className="text-(--text-color-muted)">{user.id}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card p-6 max-w-md w-full text-center space-y-4">
              <GlowText as="h2" className="text-3xl font-bold">
                找不到該用戶
              </GlowText>
              <p className="text-(--text-color-muted)">
                我們找不到與此 ID 對應的用戶。可能是用戶已刪除或您輸入了錯誤的
                ID。
              </p>
              <div className="flex justify-center gap-4 mt-2">
                <Link
                  href="/"
                  className="btn-primary px-4 py-2 rounded-full font-bold"
                >
                  返回首頁
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
