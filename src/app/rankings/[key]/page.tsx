import { MainSection } from "@/components/rankings/[key]/MainSection";
import { VALID_KEYS } from "@/libs/backend";
import { statsData } from "@/libs/rankings";
import { SupabaseStatsView } from "@/types/backend";
import { statsByKey } from "@/utils/backend";
import { formatDate } from "@/utils/date";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/rankings/[key]">): Promise<Metadata> {
  const { key } = await params;
  const label =
    statsData[key as (typeof VALID_KEYS)[number]]?.label || "排行榜";

  return {
    title: label,
    description: `查看${label}的最新排名`,
    openGraph: {
      title: label,
      description: `查看${label}的最新排名`,
      url: `/rankings/${key}`,
    },
    alternates: {
      canonical: `/rankings/${key}`,
    },
  };
}

export default async function RankingsKey({
  params,
}: PageProps<"/rankings/[key]">) {
  const { key } = await params;
  const items = await statsByKey(key as keyof SupabaseStatsView, {
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
