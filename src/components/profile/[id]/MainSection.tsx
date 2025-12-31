"use client";

import { GlowText } from "@/components/GlowText";
import Link from "next/link";
import { MyImage } from "@/components/MyImage";
import { SupabaseAllowFieldsUser, SupabaseRecord } from "@/types/backend";
import { CopyButton } from "@/components/CopyButton";
import { useMemo } from "react";

export const MainSection = ({
  user,
  records,
}: {
  user: SupabaseAllowFieldsUser | null;
  records: SupabaseRecord[];
}) => {
  const orderedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [records]);
  const highestScore = useMemo(() => {
    if (records.length === 0) return 0;
    return Math.max(...records.map((record) => record.score));
  }, [records]);
  const recent = orderedRecords.slice(0, 5);
  const formatDate = (d: string) => {
    try {
      return new Intl.DateTimeFormat("zh-TW", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(d));
    } catch {
      return d;
    }
  };
  return (
    <section className="h-full">
      <div className="container h-full">
        <div className="flex flex-col items-center justify-center h-full">
          {user ? (
            <>
              <div className="card w-full p-4 md:p-6 gap-4">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  {/* Left: Avatar + basic info */}
                  <div className="flex items-center gap-4">
                    <div className="card h-22 w-22 rounded-full overflow-hidden shrink-0 shadow-sm">
                      <MyImage
                        src={user.avatar}
                        fallbackSrc={`/default-avatar.jpg`}
                        alt={`${user.name || "用戶"} 的頭像`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <GlowText
                        as="h2"
                        className="font-bold text-lg md:text-xl"
                      >
                        {user.name || "用戶"}
                      </GlowText>
                      <div className="flex items-center gap-2 mt-1">
                        <CopyButton
                          content={`${user.id}`}
                          className="text-(--text-color-muted) text-sm"
                        >
                          {user.id}
                        </CopyButton>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="md:col-span-1">
                    <div className=" border border-(--border-color) rounded-lg p-3 h-full">
                      <div className="flex items-center justify-between">
                        <GlowText as="h3" className="font-semibold text-sm">
                          遊戲統計
                        </GlowText>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-2xl font-bold">
                            {highestScore}
                          </div>
                          <div className="text-(--text-color-muted) text-xs">
                            最高分
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {records.length}
                          </div>
                          <div className="text-(--text-color-muted) text-xs">
                            遊玩次數
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {user.created_at
                              ? formatDate(user.created_at)
                              : "-"}
                          </div>
                          <div className="text-(--text-color-muted) text-xs">
                            加入時間
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Recent records */}
                  <div className="md:col-span-1">
                    <div className=" border border-(--border-color) rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <GlowText as="h3" className="font-semibold text-sm">
                          最近紀錄
                        </GlowText>
                        <Link
                          href={`/profile/${user.id}`}
                          className="text-(--text-color-muted) text-xs"
                        >
                          全部
                        </Link>
                      </div>
                      <ul className="mt-2 space-y-2">
                        {recent.length === 0 && (
                          <li className="text-(--text-color-muted) text-sm">
                            目前尚無紀錄
                          </li>
                        )}
                        {recent.map((r) => (
                          <li
                            key={r.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="text-sm text-(--text-color-muted)">
                              {formatDate(r.created_at)}
                            </div>
                            <div className="ml-2 inline-flex items-center gap-2">
                              <span className="px-2 py-1 rounded-full text-sm font-medium">
                                {r.score}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
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
