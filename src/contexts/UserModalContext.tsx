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
import { CloseOutlined } from "@ant-design/icons";

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
  const [currUser, setCurrUser] = useState<SupabaseAllowFieldsUser | null>(null);
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
    if (!id) return;

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
  }, [id]);

  const name = currUser?.name || (id ? `用戶 ${id}` : "載入中...");
  const joinDate = useMemo(() => {
    if (!currUser) return "";
    return formatDate("YYYY/MM/DD", currUser.created_at);
  }, [currUser]);
  const orderedRecords = useMemo(() => {
    if (!records) return [];
    return [...records].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [records]);

  return (
    <userModalContext.Provider value={value}>
      {children}
      <modal.Container
        className="bg-black/40 flex items-center justify-center p-6 z-51"
        aria-labelledby="currUser-modal-title"
      >
        {id && !isLoading && (
          <div className="animate-pop card w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-full overflow-hidden">
            {/** Header */}
            <header className="text-xl flex items-center justify-between">
              <GlowText
                as="h2"
                id="currUser-modal-title"
                className="font-extrabold tracking-wider"
              >
                用戶資料
              </GlowText>
              <button
                type="button"
                aria-label="關閉"
                className="text-(--text-color-muted) hover:text-white transition-colors"
                onClick={modal.close}
              >
                <CloseOutlined />
              </button>
            </header>
            {/**頭像與名稱 */}
            <div className="flex items-center gap-4 text-2xl md:text-3xl">
              <div className="h-[2.5em] aspect-square rounded-full overflow-hidden border-2 border-(--text-color-secondary)">
                <MyImage
                  src={currUser?.avatar}
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
                  <div className="text-[0.5em] text-(--text-color-muted)">
                    {id}
                    <CopyButton
                      content={`${id}`}
                      className="ml-2 text-(--text-color-muted)"
                      aria-label="複製用戶 ID"
                      title="複製用戶ID"
                    />
                  </div>
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
