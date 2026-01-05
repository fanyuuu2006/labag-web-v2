import { MainSection } from "@/components/ranking/MainSection";
import { stats } from "@/utils/backend";

export default async function Rankings() {
  const items = await stats().then((res) => res.data);
  return <MainSection items={items} />;
}
