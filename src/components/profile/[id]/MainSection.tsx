"use client";

import { SupabaseAllowFieldsUser, SupabaseRecord } from "@/types/backend";

export const MainSection = ({
  user,
  records,
}: {
  user: SupabaseAllowFieldsUser | null;
  records: SupabaseRecord[];
}) => {
  return (
    <section className="h-full">
      <div className="contianer h-full">{}</div>
    </section>
  );
};
