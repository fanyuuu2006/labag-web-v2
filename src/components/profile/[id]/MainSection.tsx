"use client";

import { GlowText } from "@/components/GlowText";
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
      <div className="container h-full">
        {user ? (
          <></>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="card p-4">
              <GlowText as="h2">未找到該用戶資料</GlowText>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
