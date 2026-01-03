import { SupabaseRankingViewItem } from "@/types/backend";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { GlowText } from "../GlowText";
import { cn } from "@/utils/className";
import { useMemo } from "react";

export const MainSection = ({
  items,
}: {
  items: SupabaseRankingViewItem[];
}) => {
  const orderedItems = useMemo(() => {
    return items.sort((a, b) => b.score - a.score);
  }, [items]);

  return (
    <section className="h-full flex flex-col items-center justify-center p-4 md:p-6">
      <div className="card w-full max-w-3xl flex flex-col gap-6 p-6 md:p-8 max-h-full">
        <div className="flex justify-center items-center">
          <GlowText
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold underline-spread"
          >
            排行榜
          </GlowText>
        </div>

        {orderedItems.length > 0 ? (
          <div className="w-full h-full">
            <table className="w-full table-auto border-collapse text-(--text-color-primary)">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b border-(--border-color)">
                    排名
                  </th>
                  <th className="text-left p-2 border-b border-(--border-color)">
                    玩家
                  </th>
                  <th className="text-left p-2 border-b border-(--border-color)">
                    分數
                  </th>
                  <th className="text-left p-2 border-b border-(--border-color)">
                    日期
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderedItems.map((item, index) => (
                  <tr
                    key={item.record_id}
                    className={cn(
                      index % 2 === 0 ? "bg-(--background-color-alt)" : ""
                    )}
                  >
                    <td className="p-2 border-b border-(--border-color)">
                      {index + 1}
                    </td>
                    <td className="p-2 border-b border-(--border-color)">
                      <Link
                        href={`/profile/${item.user_id}`}
                        className="underline hover:text-(--text-color-secondary)"
                      >
                        {item.user_name}
                      </Link>
                    </td>
                    <td className="p-2 border-b border-(--border-color)">
                      {item.score}
                    </td>
                    <td className="p-2 border-b border-(--border-color)">
                      {formatDate("YYYY/MM/DD", item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-(--text-color-muted)">
            <p>暫無排名資料</p>
          </div>
        )}
      </div>
    </section>
  );
};
