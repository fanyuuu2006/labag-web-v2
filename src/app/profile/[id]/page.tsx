import { MainSection } from "@/components/profile/[id]/MainSection";
import { recordsById, userById } from "@/utils/backend";
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileId({ params }: PageProps) {
  const { id } = await params;
  const user = await userById(Number(id)).then((res) => res.data);
  const records = await recordsById(Number(id)).then((res) => res.data);
  return <MainSection user={user} records={records} />;
}
