# 🎰 啦八機 LaBaG

> 只需動動手指，就能在無聊時打發時間的網頁拉霸小遊戲。

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Overview

**啦八機 LaBaG** 是一款以 Next.js App Router 打造的網頁版拉霸機遊戲。專案將經典「啦八機」玩法帶上現代 Web 平台，提供流暢的轉輪動畫、音效與主題切換，並透過後端 API 支援使用者登入、金幣系統、排行榜與分享獎勵。

**解決的問題：**

- 將原本 MIT App Inventor 時代的離線小遊戲，重構為可跨裝置存取的現代 Web 應用
- 提供輕量、免安裝（亦支援 PWA）的休閒娛樂體驗
- 整合 OAuth 登入與雲端資料，讓玩家能保存進度並與他人競爭

**適合對象：**

- 想快速體驗拉霸小遊戲的一般玩家
- 學習 Next.js App Router、React Context 與外部 API 整合的前端開發者
- 對 PWA、遊戲化互動（分享獎勵、排行榜）有興趣的技術愛好者

線上版本：[https://labag.vercel.app](https://labag.vercel.app)

---

## Features

- 🎮 **三軸拉霸核心玩法** — 支援自訂下注金額，逐軸揭示符號並計算派彩
- 🔐 **OAuth 登入** — 透過 Google / GitHub 第三方登入，保存個人遊戲進度
- 🏆 **雙軌排行榜** — 依「持有金幣」與「遊玩次數」分類，展示 Top 玩家
- 🎨 **多主題模式** — 內建 Normal、SuperHHH、GreenWei、PiKaChu 等視覺主題
- 🔊 **音效與音樂控制** — 可獨立開關背景音樂與遊戲音效
- 📤 **分享獎勵機制** — 登入使用者分享專屬連結，被點擊後可獲得金幣
- 📱 **PWA 支援** — 可安裝至桌面或手機主畫面，提供接近原生 App 的體驗
- 📖 **符號圖鑑與專案介紹** — 內建 Pattern 說明 Modal 與完整開發歷程頁面

---

## Tech Stack

| 類別 | 技術 |
|------|------|
| **前端框架** | [Next.js 16](https://nextjs.org/)（App Router） |
| **UI 函式庫** | [React 19](https://react.dev/)、[Ant Design 6](https://ant.design/) |
| **語言** | [TypeScript 5](https://www.typescriptlang.org/) |
| **樣式** | [Tailwind CSS 4](https://tailwindcss.com/)、`clsx` / `tailwind-merge` |
| **遊戲邏輯** | [`labag`](https://www.npmjs.com/package/labag)（核心拉霸演算法） |
| **API / 資料** | 外部 REST API（Supabase 後端），透過 `fetcher` 封裝請求 |
| **其他** | PWA（Web App Manifest）、Next.js Middleware（分享追蹤） |
| **部署** | [Vercel](https://vercel.com/) |

---

## Project Structure

```
labag-web/
├── public/                  # 靜態資源
│   ├── audios/              # 背景音樂與音效
│   ├── icons/               # PWA 與 favicon 圖示
│   ├── images/              # 遊戲符號與主題圖片
│   └── manifest.json        # PWA 設定檔
├── src/
│   ├── app/                 # Next.js App Router 路由
│   │   ├── about/           # 關於頁面（開發歷程、技術說明）
│   │   ├── game/            # 遊戲主畫面
│   │   ├── login/           # OAuth 登入與回調
│   │   ├── rankings/        # 排行榜列表與詳情
│   │   ├── share/           # 分享連結入口（Middleware 處理）
│   │   ├── layout.tsx       # 根 Layout、SEO Metadata
│   │   ├── page.tsx         # 首頁
│   │   ├── robots.ts        # SEO robots 設定
│   │   └── sitemap.ts       # 網站地圖
│   ├── components/          # UI 元件（Header、Game、Rankings 等）
│   ├── contexts/            # React Context（User、Setting、Modal）
│   ├── hooks/               # 自訂 Hooks
│   ├── libs/                # 站點設定、後端常數、排行榜資料
│   ├── styles/              # 全域 CSS（Tailwind）
│   ├── types/               # TypeScript 型別定義
│   ├── utils/               # API 請求、音訊、日期等工具函式
│   └── middleware.ts        # 分享連結點擊追蹤與重導向
├── next.config.ts
├── package.json
└── tsconfig.json
```

### 重要目錄說明

| 目錄 | 用途 |
|------|------|
| `src/app/` | 定義所有頁面路由與 Layout，遵循 Next.js App Router 慣例 |
| `src/components/` | 依功能模組拆分的可重用 UI 元件 |
| `src/contexts/` | 管理使用者登入狀態、遊戲設定（主題、音效）與 Modal 狀態 |
| `src/utils/backend.tsx` | 封裝所有後端 API 呼叫（遊戲、使用者、排行榜、分享） |
| `src/libs/` | 站點中繼資料、導航路由與後端相關常數 |

---

## Getting Started

### 前置需求

- [Node.js](https://nodejs.org/) 18.18 或以上
- npm / yarn / pnpm（擇一）
- 可連線的 LaBaG 後端 API 服務

### 安裝與啟動

```bash
# 1. 複製專案
git clone https://github.com/<your-username>/labag-web.git
cd labag-web

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env.local
# 編輯 .env.local，填入後端 API 位址

# 4. 啟動開發伺服器
npm run dev
```

開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000)。

### 其他指令

```bash
# 程式碼檢查
npm run lint

# 建置正式版
npm run build

# 啟動正式版伺服器（需先 build）
npm run start
```

---

## Environment Variables

在專案根目錄建立 `.env.local` 檔案：

```env
# 後端 API 根網址（必填）
# 開發環境範例
NEXT_PUBLIC_BACKEND_URL=http://localhost:8787

# 正式環境範例
# NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.example.com
```

| 變數 | 必填 | 說明 |
|------|------|------|
| `NEXT_PUBLIC_BACKEND_URL` | ✅ | 後端 REST API 的根 URL，用於 OAuth 登入、遊戲邏輯、排行榜與分享功能 |

> **注意：** 以 `NEXT_PUBLIC_` 為前綴的變數會暴露至瀏覽器端，請勿存放機密金鑰。

---

## Deployment

### Vercel（推薦）

本專案預設部署於 [Vercel](https://vercel.com/)，與 Next.js 原生整合。

1. 將 Repository 連結至 Vercel 專案
2. 在 Vercel 專案設定中新增環境變數 `NEXT_PUBLIC_BACKEND_URL`
3. 推送至 main 分支即可自動觸發建置與部署

---

## Future Improvements

- **離線遊玩模式** — 擴充 Service Worker，讓部分 UI 與靜態資源可在無網路時存取
- **即時排行榜更新** — 引入 WebSocket 或 SSE，讓排行榜資料無需手動重新整理
- **更多遊戲模式** — 新增限時活動、每日簽到或特殊符號組合等玩法擴充
- **效能優化** — 對遊戲動畫與音效資源實施 lazy loading 與 CDN 快取策略
- **無障礙（a11y）強化** — 補充鍵盤操作支援與 ARIA 標籤，提升螢幕閱讀器相容性

---

## License

本專案以 [MIT License](./LICENSE) 授權。

---

## 版權聲明

本專案由 🍚🐟 創建，僅供學習與娛樂用途。所有音樂與圖片素材均來源於公開資源，若有侵權請聯繫刪除。
