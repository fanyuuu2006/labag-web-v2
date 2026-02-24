"use client";
import { useModal } from "@/hooks/useModal";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { OverrideProps } from "fanyucomponents";
import {
  SupabaseAllowFieldsUser,
  SupabaseRecord,
  SupabaseUser,
  SupabaseUserStatsViewItem,
} from "@/types/backend";
import { CopyButton } from "@/components/CopyButton";
import { GlowText } from "@/components/GlowText";
import { MyImage } from "@/components/MyImage";
import { formatDate } from "@/utils/date";
import { recordsById, statsById, userById } from "@/utils/backend";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { statsData } from "@/libs/rankings";

type UserModalContextType = OverrideProps<
  ReturnType<typeof useModal>,
  {
    open: (id: SupabaseUser["id"]) => void;
  }
>;

const userModalContext = createContext<UserModalContextType | null>(null);

export const UserModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const modal = useModal({});
  const [id, setId] = useState<SupabaseUser["id"] | null>(null);
  const [currUser, setCurrUser] = useState<SupabaseAllowFieldsUser | null>(
    null
  );
  const [stats, setStats] = useState<SupabaseUserStatsViewItem | null>(null);
  const [records, setRecords] = useState<SupabaseRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(
    () => ({
      ...modal,
      open: (newId: SupabaseUser["id"]) => {
        if (newId !== id) {
          setCurrUser(null);
          setStats(null);
          setRecords(null);
        }
        setId(newId);
        modal.open();
      },
    }),
    [modal, id]
  );

  useEffect(() => {
    if (!id || !modal.isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userRes, statsRes, recordRes] = await Promise.all([
          userById(id),
          statsById(id),
          recordsById(id, {
            count: "10",
          }),
        ]);
        setCurrUser(userRes.data);
        setStats(statsRes.data);
        setRecords(recordRes.data);
      } catch (error) {
        console.error("獲取用戶資料失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, modal.isOpen]);

  const name = currUser?.name || (id ? `用戶 ${id}` : "載入中...");
  const joinDate = useMemo(() => {
    if (!currUser) return "---";
    return formatDate("YYYY/MM/DD", currUser.created_at);
  }, [currUser]);

  const orderedRecords = useMemo(() => {
    if (!records) return [];
    // ISO 8601 字串可以直接比較，比 new Date() 更快
    return [...records].sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    );
  }, [records]);

  return (
    <userModalContext.Provider value={value}>
      {children}
      <modal.Container
        className="bg-black/40 flex items-center justify-center p-2 md:p-4 z-51"
        aria-labelledby="currUser-modal-title"
      >
        {id && (
          <div className="animate-pop card w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-[85vh] overflow-hidden">
            {/** Header */}
            <header className="flex items-center justify-between">
              <GlowText
                as="h2"
                id="currUser-modal-title"
                className="text-lg md:text-xl font-extrabold tracking-wider"
              >
                用戶資料
              </GlowText>
              <button
                type="button"
                aria-label="關閉"
                className="text-(--muted)"
                onClick={modal.close}
              >
                <CloseOutlined className="text-xl" />
              </button>
            </header>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 h-full">
                <LoadingOutlined className="text-5xl text-(--normal-primary)" />
                <p className="text-(--muted) animate-pulse tracking-widest">
                  資料讀取中...
                </p>
              </div>
            ) : (
              <>
                {/** User Info Section */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="relative aspect-square w-auto h-16 md:h-16 shrink-0 rounded-full overflow-hidden border-2 border-(--secondary)">
                    <MyImage
                      src={currUser?.avatar}
                      fallbackSrc={`/default-avatar.jpg`}
                      alt={`${name} 的頭像`}
                      title={`${name} 的頭像`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xl md:text-2xl flex flex-col gap-1 min-w-0 flex-1">
                    <GlowText as="h3" className="font-bold">
                      {name}
                    </GlowText>
                    <div className="flex items-center gap-2 text-[0.5em] text-(--muted)">
                      <span className="font-mono">ID: {id}</span>
                      <CopyButton
                        content={`${id}`}
                        className="text-(--muted)"
                        aria-label="複製用戶 ID"
                        title="複製用戶ID"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {[
                    {
                      label: statsData.highest_score.label,
                      value: stats?.highest_score?.toLocaleString() || 0,
                    },
                    {
                      label: statsData.play_count.label,
                      value: stats?.play_count?.toLocaleString() || 0,
                    },
                    { label: "加入日期", value: joinDate },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`text-base sm:text-lg md:text-xl lg:text-2xl flex flex-col items-center justify-center`}
                    >
                      <GlowText className={`font-extrabold`}>
                        {item.value}
                      </GlowText>
                      <span className="text-[0.5em] text-(--muted)">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Records List */}
                <div className="flex flex-col gap-3 min-h-0 flex-1">
                  <div className="text-base md:text-lg flex items-center justify-between px-1 border-b border-white/10 pb-2">
                    <h3 className="font-bold flex items-center gap-2 text-white/90">
                      最近遊玩紀錄
                    </h3>
                    <span className="text-[0.75em] text-(--muted) bg-white/5 px-2 py-1 rounded-full">
                      最近 10 筆
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 overflow-y-auto">
                    {orderedRecords.length > 0 ? (
                      orderedRecords.map((record) => (
                        <div
                          key={record.id}
                          className="card-primary group relative flex items-center justify-between p-3 md:p-4 transition-all duration-300 hover:brightness-110"
                        >
                          <div className="flex flex-col gap-0.5">
                            <time
                              dateTime={new Date(
                                record.created_at
                              ).toISOString()}
                              className="text-sm md:text-base font-bold text-white/90 tracking-wide"
                              title={formatDate(
                                "YYYY/MM/DD HH:mm",
                                record.created_at
                              )}
                            >
                              {formatDate(
                                "YYYY/MM/DD HH:mm",
                                record.created_at
                              )}
                            </time>
                            <span className="text-[10px] md:text-xs text-(--muted) font-mono">
                              ID: {record.id}
                            </span>
                          </div>
                          <div className="flex flex-col items-end justify-center">
                            <div className="flex items-baseline gap-1.5">
                              <GlowText className="text-xl md:text-2xl font-black tabular-nums tracking-tight drop-shadow-lg">
                                {record.score.toLocaleString()}
                              </GlowText>
                              <span className="text-xs font-medium text-(--muted) mb-1">
                                分
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="card-primary flex flex-col items-center justify-center py-12 h-full">
                        <p>尚無遊玩紀錄</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </modal.Container>
    </userModalContext.Provider>
  );
};

export const useUserModal = () => {
  const context = useContext(userModalContext);
  if (!context) {
    throw new Error("useUserModal 必須在 UserModalProvider 內使用");
  }
  return context;
};
