import { MainSection } from "@/components/rankings/[key]/MainSection";
import { VALID_KEYS } from "@/libs/backend";
import { SupabaseUserStatsViewItem } from "@/types/backend";
import { statsByKey } from "@/utils/backend";
import { formatDate } from "@/utils/date";

export default async function RankingsKey({
  params,
}: PageProps<"/rankings/[key]">) {
  const { key } = await params;
  const items = await statsByKey(key as keyof SupabaseUserStatsViewItem, {
    count: "100",
  }).then((res) => res.data);
  const fetchTime = formatDate("YYYY/MM/DD HH:mm:ss", new Date());
  return (
    <MainSection
      items={items}
      fetchTime={fetchTime}
      rankKey={key as (typeof VALID_KEYS)[number]}
    />
  );
}
