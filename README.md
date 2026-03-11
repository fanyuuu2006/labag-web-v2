# 啦八機 (網頁版)

## 簡介

此專案是一個以 **Next.js 16**、**React 19** 與 **TypeScript** 為基礎開發的網頁遊戲應用程式，並採用 **Tailwind CSS 4** 進行現代化樣式設計。透過網頁技術重現並強化了經典的「啦八機」遊戲體驗。

## 創作背景

2023 年 6 月 22 日，[治平高中](https://www.cpshs.tyc.edu.tw/)商務二孝的那個本壘板 🍚🐟 正處於很無聊的狀態，於是想到國昌老師教的 [MIT App Inventor 2](https://ai2.appinventor.mit.edu/) 的存在，想無聊做個小遊戲，運用以前玩 Minecraft 做紅石機關的邏輯、從手機相簿裡面隨便找的幾張圖片，以及網路上隨便抓的垃 X 音效與音樂，於是第一代啦八機誕生了。

後續陸續新增了 超級阿禾模式 (SuperHHH)、綠光阿瑋模式 (GreenWei)、皮卡丘充電模式 (PiKaChu) 等模式。

2024 年 8 月，🍚🐟 已經高中畢業，即將進入大學，去買了人生第一台電腦，為了學習 Python，於是一邊透過用 Python 還原啦八機，一邊學習相關知識。

2025 年 2 月，🍚🐟 開始接觸前端技術，決定使用 Next.js 重構啦八機，藉由網頁應用呈現更豐富的互動體驗，同時學習現代前端開發的最佳實踐。

## 技術棧

- **核心框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI 庫**: [React 19](https://react.dev/), [Ant Design 6](https://ant.design/)
- **樣式**: [Tailwind CSS 4](https://tailwindcss.com/)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **遊戲邏輯**: `labag` (核心邏輯庫)
- **其他**: PWA 支援 (可安裝為應用程式)

## 其他功能特點

- **PWA 支援**：支援安裝至桌面或手機，提供原生 App 般的體驗。
- **排行榜系統**：支援將分數上傳，與其他玩家競爭。
- **動態符號生成**：每回合隨機生成符號，根據符號組合計算分數。
- **資源整合**：內建圖片與音效資源，提供豐富的視覺與聽覺體驗。

## 快速開始

1. **安裝依賴**

   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

2. **啟動開發伺服器**

   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

3. **開啟瀏覽器**
   前往 [http://localhost:3000](http://localhost:3000) 查看結果。

## 版權聲明

此項目由 🍚🐟 創建，僅供學習與娛樂用途。所有音樂與圖片素材均來源於公開資源，若有侵權請聯繫刪除。
