import { MainSection } from "@/components/profile/[id]/MainSection";
import { recordsById, statsById, userById } from "@/utils/backend";
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileId({ params }: PageProps) {
  const { id } = await params;
  const user = await userById(Number(id)).then((res) => res.data);
  const records = await recordsById(Number(id), {
    count: "10",
  }).then((res) => res.data);
  const stats = await statsById(Number(id)).then((res) => res.data);
  return <MainSection user={user} records={records} stats={stats} />;
}
