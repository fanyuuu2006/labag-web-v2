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
                <tr key={index}>
                  <td className="text-center p-2">
                    <Rank index={index} className="font-bold text-lg" />
                  </td>
                  <td className="text-center p-2">
                    <Link
                      href={`/profile/${item.user_id}`}
                      className="font-semibold hover:underline"
                    >
                      {item.user_name}
                    </Link>
                  </td>
                  <td className="text-center p-2 font-bold">{item.score}</td>
                  <td className="text-center p-2">
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
