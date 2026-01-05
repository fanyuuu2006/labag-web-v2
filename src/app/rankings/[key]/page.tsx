import { MainSection } from "@/components/rankings/[key]/MainSection";
import { SupabaseUserStatsViewItem } from "@/types/backend";
import { statsByKey } from "@/utils/backend";
import { formatDate } from "@/utils/date";

export default async function Rankings({
  params,
}: PageProps<"/rankings/[key]">) {
  const { key } = await params;
  const items = await statsByKey(key as keyof SupabaseUserStatsViewItem, {
    count: "100",
  }).then((res) => res.data);
  const fetchTime = formatDate("YYYY/MM/DD HH:mm:ss", new Date());
  return <MainSection items={items} fetchTime={fetchTime} rankKey={key as keyof SupabaseUserStatsViewItem} />;
}
