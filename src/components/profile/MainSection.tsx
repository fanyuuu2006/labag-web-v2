"use client";

import { useUser } from "@/contexts/UserContext";

export const MainSection = () => {
  const { user } = useUser();
  return (
    <section className="h-full">
      <div className="contianer h-full">{user ? <></> : <></>}</div>
    </section>
  );
};
