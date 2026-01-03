import { SupabaseRankingViewItem } from "@/types/backend";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { GlowText } from "../GlowText";
import { cn } from "@/utils/className";
import { useMemo } from "react";
import { DistributiveOmit, OverrideProps } from "fanyucomponents";

type RankPorps = OverrideProps<
  DistributiveOmit<React.HTMLAttributes<HTMLSpanElement>, "children">,
  {
    index: number;
  }
>;
const Rank = ({ index, ...rest }: RankPorps) => {
  const children = useMemo(() => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return (index + 1).toString();
    }
  }, [index]);

  return <span {...rest}>{children}</span>;
};

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
      <div className="card w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-full overflow-hidden">
        <div className="flex justify-center items-center py-2">
          <GlowText
            as="h2"
            className="text-3xl sm:text-4xl font-extrabold tracking-wider"
          >
            排行榜
          </GlowText>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-(--text-color-muted)">
              {[
                {
                  label: "#",
                  className: "text-left",
                },
                {
                  label: "玩家",
                  className: "text-left",
                },
                {
                  label: "分數",
                  className: "text-right",
                },
                {
                  label: "日期",
                  className: "text-right",
                },
              ].map((header, index) => (
                <th className={cn(header.className)} key={index}>
                  <span>{header.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderedItems.length === 0 ? (
              <>
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-(--text-color-muted)"
                  >
                    當前無排行資料
                  </td>
                </tr>
              </>
            ) : (
              orderedItems.map((item, index) => (
                <tr
                  key={index}
                  className={cn(
                    index % 2 === 0 ? "bg-black/20" : "bg-black/10"
                  )}
                >
                  <td className="py-2 px-4">
                    <Rank index={index} className="font-bold" />
                  </td>
                  <td className="py-2 px-4">
                    <Link
                      href={`/profile/${item.user_id}`}
                      className="font-semibold underline hover:text-(--text-color-primary) transition-colors"
                    >
                      {item.user_name || "匿名玩家"}
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-right font-bold">
                    {item.score}
                  </td>
                  <td className="py-2 px-4 text-right text-(--text-color-muted)">
                    {formatDate("YYYY/MM/DD", item.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
