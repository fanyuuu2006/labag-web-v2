"use client";

import { GlowText } from "@/components/GlowText";
import Link from "next/link";
import { MyImage } from "@/components/MyImage";
import { SupabaseAllowFieldsUser, SupabaseRecord } from "@/types/backend";
import { CopyButton } from "@/components/CopyButton";
import { useMemo } from "react";
import { formatDate } from "@/utils/date";

const RECORD_SIZE = 10;
export const MainSection = ({
  user,
  records,
}: {
  user: SupabaseAllowFieldsUser | null;
  records: SupabaseRecord[];
}) => {
  const name = user?.name || `用戶 ${user?.id}`;

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
  const joinDate = useMemo(() => {
    if (!user) return "";
    return formatDate(user.created_at);
  }, [user]);
  return (
    <section className="h-full">
      <div className="container h-full">
        <div className="flex flex-col items-center justify-center h-full">
          {user ? (
            <>
              {/**用戶資料卡片 */}
              <div className="card p-4 md:p-6 lg-p-8 gap-4 w-full max-w-4xl max-h-full">
                {/**名稱與頭像 */}
                <div className="w-full flex flex-col gap-4">
                  <div className="text-xl md:text-2xl lg:text-3xl flex items-center gap-4">
                    <div className="card h-[3em] w-[3em] rounded-full overflow-hidden shrink-0 shadow-sm">
                      <MyImage
                        src={user.avatar}
                        fallbackSrc={`/default-avatar.jpg`}
                        alt={`${name} 的頭像`}
                        title={`${name} 的頭像`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col items-start gap-1">
                        <GlowText as="h2" className="font-bold">
                          {name}
                        </GlowText>
                        <CopyButton
                          content={`${user.id}`}
                          className="text-[0.5em] text-(--text-color-muted)"
                        >
                          用戶ID: {user.id}
                        </CopyButton>
                      </div>
                    </div>
                  </div>

                  {/**用戶統計資料 */}
                  <div className="text-lg md:text-xl lg:text-2xl flex items-center justify-between text-nowrap gap-4 md:gap-6">
                    {[
                      {
                        label: "最高分數",
                        value: highestScore,
                      },
                      {
                        label: "遊玩次數",
                        value: records.length,
                      },
                      {
                        label: "加入日期",
                        value: joinDate,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="w-full flex flex-col items-center"
                      >
                        <GlowText className="font-extrabold">
                          {item.value}
                        </GlowText>
                        <span className="text-[0.5em] text-(--text-color-muted)">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/**遊玩紀錄列表 */}
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-lg font-bold">最近遊玩紀錄</h3>
                      <span className="text-sm text-(--text-color-muted)">
                        顯示最近 {Math.min(records.length, RECORD_SIZE)} 筆
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 max-h-100 overflow-y-auto">
                      {orderedRecords.length > 0 ? (
                        orderedRecords.slice(0, RECORD_SIZE).map((record) => (
                          <div
                            key={record.id}
                            className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-transparent hover:border-(--text-color-secondary) hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-(--text-color-muted) group-hover:text-(--text-color-secondary) transition-colors">
                                {formatDate(record.created_at)}
                              </span>
                            </div>

                            <div className="flex items-baseline gap-1.5">
                              <GlowText className="text-2xl font-bold">
                                {record.score.toLocaleString()}
                              </GlowText>
                              <span className="text-xs text-(--text-color-muted)">
                                分
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-white/5 border border-dashed border-white/10 text-(--text-color-muted) gap-2">
                          <div className="text-4xl opacity-50">🎮</div>
                          <p>尚無遊玩紀錄</p>
                        </div>
                      )}
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
