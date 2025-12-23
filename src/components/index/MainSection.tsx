"use client";

import { game } from "@/libs/game";
import Link from "next/link";

export const MainSection = () => {
  return (
    <section className="h-full min-h-[80vh] flex flex-col items-center justify-center py-12">
      <div className="container flex flex-col items-center justify-center">
        <Link
          href={"/game"}
          className="btn-primary font-bold px-6 py-3 text-2xl rounded-full"
          onClick={() => {
            game.init();
          }}
        >
          開始遊戲
        </Link>
      </div>
    </section>
  );
};
