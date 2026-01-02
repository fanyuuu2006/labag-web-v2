import { SupabaseRankingViewItem } from "@/types/backend";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { GlowText } from "../GlowText";

export const MainSection = ({
  items,
}: {
  items: SupabaseRankingViewItem[];
}) => {
  return (
    <section className="h-full">
      <div className="container h-full flex items-center justify-center p-4 md:p-6">
        <div className="card w-full max-w-4xl flex flex-col gap-6 p-6 md:p-8 max-h-full overflow-hidden">
          {/**標題 */}
          <h2 className="text-3xl sm:text-4xl font-extrabold underline-spread text-center">
            排行榜
          </h2>
          {/**列表 */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 border-b-2 border-(--border-color)">
                    排名
                  </th>
                  <th className="text-left p-3 border-b-2 border-(--border-color)">
                    玩家
                  </th>
                  <th className="text-left p-3 border-b-2 border-(--border-color)">
                    分數
                  </th>
                  <th className="text-left p-3 border-b-2 border-(--border-color)">
                    時間
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.user_id}
                    className="odd:bg-black/10 even:bg-black/20"
                  >
                    <td className="p-3 border-b border-(--border-color)">
                      {index + 1}
                    </td>
                    <td className="p-3 border-b border-(--border-color)">
                      <GlowText as={Link} href={`/profile/${item.user_id}`}>
                        {item.user_name}
                      </GlowText>
                    </td>
                    <td className="p-3 border-b border-(--border-color)">
                      {item.score}
                    </td>
                    <td className="p-3 border-b border-(--border-color)">
                      {formatDate("YYYY/MM/DD HH:mm:ss", item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
