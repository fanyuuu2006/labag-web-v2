"use client";

import { site } from "@/libs/site";
import { GlowText } from "@/components/GlowText";
import { GithubOutlined } from "@ant-design/icons";
import { OutsideLink } from "fanyucomponents";

export const MainSection = () => {
  return (
    <section className="flex flex-col items-center justify-center p-6 md:p-12 gap-8 min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl w-full flex flex-col gap-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <GlowText
          as="h1"
          className="text-4xl md:text-6xl font-bold tracking-wider"
        >
          關於 {site.title}
        </GlowText>

        <div className="bg-black/20 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-white/10 shadow-xl text-left space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2">網站介紹</h2>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light">
              {site.description}
              。這是一個專為消磨時間設計的簡單網頁遊戲，結合了現代化的介面設計與流暢的操作體驗。
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2">關於專案</h2>
            <p className="text-gray-300 leading-relaxed">
              本專案是一個開源項目，旨在探索 Next.js 與現代前端技術的應用。
              無論您是在通勤途中，還是工作間隙，都可以隨時打開享受片刻輕鬆。
            </p>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <span className="text-sm text-gray-400">
                © {new Date().getFullYear()} Fanyu. Developed with ❤️
              </span>
            </div>

            <OutsideLink
              href="https://github.com/fanyuuu2006/labag-web-v2"
              className="card primary rounded-full flex items-center gap-2 px-5 py-2.5"
            >
              <GithubOutlined className="text-xl" />
              <span>GitHub</span>
            </OutsideLink>
          </div>
        </div>
      </div>
    </section>
  );
};
