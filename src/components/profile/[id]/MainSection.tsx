"use client";

import { GlowText } from "@/components/GlowText";
import Link from "next/link";
import { MyImage } from "@/components/MyImage";
import {
  SupabaseAllowFieldsUser,
  SupabaseRecord,
  SupabaseUserStatsViewItem,
} from "@/types/backend";
import { CopyButton } from "@/components/CopyButton";
import { useMemo } from "react";
import { formatDate } from "@/utils/date";

export const MainSection = ({
  user,
  records,
  stats,
}: {
  user: SupabaseAllowFieldsUser | null;
  records: SupabaseRecord[] | null;
  stats: SupabaseUserStatsViewItem | null;
}) => {
  const name = user?.name || `用戶 ${user?.id}`;

  const orderedRecords = useMemo(() => {
    if (!records) return [];
    return [...records].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [records]);
  const joinDate = useMemo(() => {
    if (!user) return "";
    return formatDate("YYYY/MM/DD", user.created_at);
  }, [user]);
  return (
    <section className="h-full">
      <div className="container h-full flex items-center justify-center p-4 md:p-6">
        {user ? (
          <div className="card w-full max-w-3xl flex flex-col gap-6 p-6 md:p-8 max-h-full overflow-hidden">
            {/**頭像與名稱 */}
            <div className="flex items-center gap-4 text-2xl md:text-3xl">
              <div className="h-[3em] aspect-square rounded-full overflow-hidden border-2 border-(--text-color-secondary)">
                <MyImage
                  src={user.avatar}
                  fallbackSrc={`/default-avatar.jpg`}
                  alt={`${name} 的頭像`}
                  title={`${name} 的頭像`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <GlowText as="h2" className=" font-bold">
                  {name}
                </GlowText>
                <div className="flex items-center">
                  <CopyButton
                    content={`${user.id}`}
                    className="text-[0.5em] text-(--text-color-muted)"
                  >
                    用戶ID: {user.id}
                  </CopyButton>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 p-2">
              {[
                { label: "最高分數", value: stats?.highest_score || 0 },
                { label: "遊玩次數", value: stats?.play_count || 0 },
                { label: "加入日期", value: joinDate },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-lg md:text-xl flex flex-col items-center justify-center gap-1"
                >
                  <GlowText className="font-extrabold">{item.value}</GlowText>
                  <span className="text-[0.5em] text-(--text-color-muted)">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Records List */}
            <div className="flex flex-col gap-3 h-100 md:h-120 overflow-hidden">
              <div className="flex items-center justify-between px-1 shrink-0">
                <h3 className="text-base font-bold flex items-center gap-2">
                  最近遊玩紀錄
                </h3>
                <span className="text-xs text-(--text-color-muted)">
                  顯示最近 10 筆
                </span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto">
                {orderedRecords.length > 0 ? (
                  orderedRecords.map((record) => (
                    <div
                      key={record.id}
                      className="group flex items-center justify-between p-2 md:p-4 rounded-xl bg-white/5 border border-transparent hover:border-(--text-color-secondary) hover:bg-white/10 transition-all duration-200"
                    >
                      <span className="text-xs md:text-sm text-(--text-color-muted) group-hover:text-white transition-colors">
                        {formatDate("YYYY/MM/DD HH:mm:ss", record.created_at)}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <GlowText className="text-lg md:text-xl font-bold">
                          {record.score.toLocaleString()}
                        </GlowText>
                        <span className="text-xs text-(--text-color-muted)">
                          分
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-white/5 border border-dashed border-white/10 text-(--text-color-muted) gap-3">
                    <p>尚無遊玩紀錄</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-8 max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <GlowText as="h2" className="text-3xl font-bold">
                找不到該用戶
              </GlowText>
              <p className="text-(--text-color-muted)">
                我們找不到與此 ID 對應的用戶。
                <br />
                可能是用戶已刪除或您輸入了錯誤的 ID。
              </p>
            </div>
            <Link
              href="/"
              className="btn-primary px-6 py-2 rounded-full font-bold inline-block"
            >
              返回首頁
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
