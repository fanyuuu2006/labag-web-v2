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

        <div className="w-full rounded-md border border-(--border-color) overflow-hidden">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-(--text-color-muted)">
                {[
                  {
                    label: "#",
                    className: "",
                  },
                  {
                    label: "玩家",
                    className: "",
                  },
                  {
                    label: "分數",
                    className: "",
                  },
                  {
                    label: "日期",
                    className: "",
                  },
                ].map((header, index) => (
                  <th
                    className={cn("text-center p-2", header.className)}
                    key={index}
                  >
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
                    className={cn({
                      "bg-yellow-400/20": index === 0,
                      "bg-gray-400/20": index === 1,
                      "bg-amber-800/20": index === 2,
                    })}
                    key={index}
                    id={index.toString()}
                  >
                    {[
                      {
                        value: <Rank index={index} />,
                        className: "",
                      },
                      {
                        value: (
                          <Link
                            href={`/profile/${item.user_id}`}
                            className="font-semibold"
                          >
                            {item.user_name}
                          </Link>
                        ),
                        className: "",
                      },
                      {
                        value: <GlowText>{item.score}</GlowText>,
                        className: "font-bold",
                      },
                      {
                        value: formatDate("YYYY/MM/DD\nHH:mm:ss", item.created_at),
                        className: "text-(--text-color-muted) text-[0.5em]",
                      },
                    ].map((cell, cellIndex) => {
                      return (
                        <td
                          key={cellIndex}
                          className={cn("p-2 text-center", cell.className)}
                        >
                          {cell.value}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
