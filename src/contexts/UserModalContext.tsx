"use client";
import { useModal } from "@/hooks/useModal";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { OverrideProps } from "fanyucomponents";
import {
  SupabaseAllowFieldsUser,
  SupabaseSpin,
  SupabaseStatsView,
  SupabaseUser,
} from "@/types/backend";
import { CopyButton } from "@/components/CopyButton";
import { GlowText } from "@/components/GlowText";
import { MyImage } from "@/components/MyImage";
import { formatDate } from "@/utils/date";
import { spinsByUserId, statsById, userById } from "@/utils/backend";
import { CloseOutlined } from "@ant-design/icons";
import { statsData } from "@/libs/rankings";
import { FormatDate } from "@/components/FormatDate";
import { usePatternModal } from "./PatternModalContext";

const SPINS_COUNT = 30;

type SpinCardProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    spin: SupabaseSpin;
  }
>;
const SpinCard = ({ spin, ...rest }: SpinCardProps) => {
  const pm = usePatternModal();
  return (
    <div
      className="card primary rounded-2xl flex items-center justify-between py-3 px-4"
      {...rest}
    >
      <div className="flex flex-col gap-2">
        <FormatDate
          title={true}
          date={[spin.created_at]}
          className="text-sm font-bold tracking-wide"
        >
          YYYY/MM/DD HH:mm
        </FormatDate>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {[
              {
                label: "下注",
                value: spin.bet.toLocaleString(),
              },
              {
                label: "倍率",
                value: `${spin.multiplier}x`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="card primary px-2 py-0.5 rounded-full text-sm font-semibold flex items-center gap-1 shrink-0"
              >
                <span className="text-xs text-(--muted)">
                  {item.label}
                </span>
                <GlowText className="font-mono text-sm">{item.value}</GlowText>
              </div>
            ))}
          </div>
        </div>

        <span className="text-xs text-(--muted) font-mono">
          ID: {spin.id}
        </span>
      </div>

      <div className="flex flex-col items-end justify-center gap-2">
        <div className="flex items-baseline gap-1.5 shrink-0">
          <GlowText className="text-xl md:text-2xl font-black tabular-nums tracking-tight">
            {spin.reward.toLocaleString()}
          </GlowText>
        </div>

        {Array.isArray(spin.reels) && spin.reels.length > 0 && (
          <div className="flex items-center gap-2 text-2xl md:text-3xl">
            {spin.reels.map((p, i: number) => (
              <button
                key={i}
                aria-label={`查看圖示 ${p?.id ?? i}`}
                className="card secondary rounded-lg w-[1.5em] h-[1.5em] flex items-center justify-center overflow-hidden shrink-0"
                onClick={() => pm.open(p.id)}
              >
                {p?.image ? (
                  <MyImage
                    src={p.image}
                    alt={p.id || `reel-${i}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-(--muted) flex items-center justify-center h-full">
                    {p?.id ?? "?"}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
    null,
  );
  const [stats, setStats] = useState<SupabaseStatsView | null>(null);
  const [spins, setSpins] = useState<SupabaseSpin[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(
    () => ({
      ...modal,
      open: (newId: SupabaseUser["id"]) => {
        if (newId !== id) {
          setCurrUser(null);
          setStats(null);
          setSpins(null);
        }
        setId(newId);
        modal.open();
      },
    }),
    [modal, id],
  );

  useEffect(() => {
    if (!id || !modal.isOpen) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userRes, statsRes, recordRes] = await Promise.all([
          userById(id),
          statsById(id),
          spinsByUserId(id, { count: `${SPINS_COUNT}` }),
        ]);
        setCurrUser(userRes.data);
        setStats(statsRes.data);
        setSpins(recordRes.data);
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

  const orderedSpins = useMemo(() => {
    if (!spins) return [];
    // ISO 8601 字串可以直接比較，比 new Date() 更快
    return [...spins].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [spins]);

  return (
    <userModalContext.Provider value={value}>
      {children}
      <modal.Container
        className="bg-black/40 flex items-center justify-center p-4 z-51"
        aria-labelledby="currUser-modal-title"
      >
        {id && (
          <div className="animate-pop card rounded-2xl w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-[85vh] overflow-hidden">
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
              <div className="flex flex-col gap-4 h-full animate-pulse select-none">
                {/* Skeleton User Info */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-16 h-16 rounded-full bg-white/10 shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-6 w-32 bg-white/10 rounded" />
                    <div className="h-4 w-24 bg-white/5 rounded" />
                  </div>
                </div>

                {/* Skeleton Stats Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg bg-white/5 h-20"
                    >
                      <div className="h-6 w-16 bg-white/10 rounded" />
                      <div className="h-3 w-10 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>

                {/* Skeleton Records List */}
                <div className="flex flex-col gap-3 flex-1 min-h-0">
                  <div className="flex justify-between items-center px-1 pb-2 border-b border-white/10">
                    <div className="h-6 w-32 bg-white/10 rounded" />
                    <div className="h-5 w-20 bg-white/5 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-2 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 w-full rounded-xl bg-white/5"
                      />
                    ))}
                  </div>
                </div>
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
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {[
                    {
                      label: statsData.user_coins.label,
                      value: stats?.user_coins?.toLocaleString() || 0,
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

                {/* 紀錄列表 */}
                <div className="flex flex-col gap-3 min-h-0 flex-1">
                  <div className="text-base md:text-lg flex items-center justify-between px-1 border-b border-white/10 pb-2">
                    <h3 className="font-bold flex items-center gap-2 text-white/90">
                      最近紀錄
                    </h3>
                    <span className="text-[0.75em] text-(--muted) bg-white/5 px-2 py-1 rounded-full">
                      最近 {SPINS_COUNT} 筆
                    </span>
                  </div>

                  <div
                    className="flex flex-col gap-2 overflow-y-auto"
                    style={{
                      scrollbarWidth: "none",
                    }}
                  >
                    {orderedSpins.length > 0 ? (
                      orderedSpins.map((spin) => (
                        <SpinCard key={spin.id} spin={spin} />
                      ))
                    ) : (
                      <div className="card primary rounded-2xl flex flex-col items-center justify-center py-12 h-full">
                        <p>尚無紀錄</p>
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
