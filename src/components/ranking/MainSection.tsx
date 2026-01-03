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
  let children: string;
  switch (index) {
    case 0:
      children = "🥇";
      break;
    case 1:
      children = "🥈";
      break;
    case 2:
      children = "🥉";
      break;
    default:
      children = (index + 1).toString();
  }

  return <span {...rest}>{children}</span>;
};

export const MainSection = ({
  items,
}: {
  items: SupabaseRankingViewItem[];
}) => {
  const orderedItems = useMemo(() => {
    return [...items].sort((a, b) => b.score - a.score);
  }, [items]);

  return (
    <section className="h-full flex flex-col items-center justify-center p-4 md:p-6">
      <div className="card w-full max-w-3xl flex flex-col gap-4 p-4 md:p-6 max-h-full overflow-hidden">
        <div className="flex justify-center items-center py-2 shrink-0">
          <GlowText
            as="h2"
            className="text-3xl sm:text-4xl font-extrabold tracking-wider"
          >
            排行榜
          </GlowText>
        </div>

        <div className="w-full rounded-md border border-(--border-color) overflow-y-auto flex-1 min-h-0 relative scrollbar-thin">
          <table className="text-md md:text-lg lg:text-xl w-full table-auto border-collapse">
            <thead className="text-[0.75em] text-(--text-color-muted) sticky top-0 bg-(--background-color) z-10 backdrop-blur-md">
              <tr>
                <th className="text-center p-2">#</th>
                <th className="text-center p-2">玩家</th>
                <th className="text-center p-2">分數</th>
                <th className="text-center p-2">日期</th>
              </tr>
            </thead>
            <tbody>
              {orderedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-(--text-color-muted)"
                  >
                    當前無排行資料
                  </td>
                </tr>
              ) : (
                orderedItems.map((item, index) => (
                  <tr
                    className={cn(
                      "hover:backdrop-brightness-105 transition-colors",
                      {
                        "bg-yellow-400/20": index === 0,
                        "bg-gray-400/20": index === 1,
                        "bg-amber-800/20": index === 2,
                      }
                    )}
                    key={item.record_id}
                    id={item.record_id.toString()}
                  >
                    <td className="p-2 text-center">
                      <Rank index={index} />
                    </td>
                    <td className="p-2 text-center text-nowrap">
                      <Link
                        href={`/profile/${item.user_id}`}
                        className="font-semibold hover:underline"
                      >
                        {item.user_name}
                      </Link>
                    </td>
                    <td className="p-2 text-center font-bold">
                      <GlowText>{item.score}</GlowText>
                    </td>
                    <td className="p-2 text-center text-(--text-color-muted) text-[0.5em]">
                      {formatDate("YYYY/MM/DD", item.created_at)}
                    </td>
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
