import { MainSection } from "@/components/ranking/MainSection";
import { ranking } from "@/utils/backend";

export default async function Rankings() {
  const items = await ranking().then((res) => res.data);
  return <MainSection items={items} />;
}
