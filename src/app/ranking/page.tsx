import { MainSection } from "@/components/ranking/MainSection";
import { stats } from "@/utils/backend";
import { formatDate } from "@/utils/date";

export default async function Rankings() {
  const items = await stats().then((res) => res.data);
  const fetchTime = formatDate("YYYY/MM/DD HH:mm:ss", new Date());
  return <MainSection items={items} fetchTime={fetchTime} />;
}
