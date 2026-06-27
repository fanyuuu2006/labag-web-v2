# 🎰 啦八機 LaBaG Web

> 只需動動手指，就能在無聊時候打發時間的線上拉霸小遊戲

[![Live Demo](https://img.shields.io/badge/demo-labag.vercel.app-000?style=flat-square)](https://labag.vercel.app)

---

## Overview

**啦八機 LaBaG Web** 是經典拉霸機遊戲「啦八機」的 Web 版前端，使用 Next.js App Router 建構。玩家可透過 Google 或 GitHub 登入，進行轉動、累積金幣，並在排行榜上與其他玩家競爭。

本專案解決的是：將原本 MIT App Inventor 製作的行動端小遊戲，以現代 Web 技術重構為可跨裝置存取、支援 PWA 安裝、具備社群分享與排行榜功能的完整 Web 應用。

**適合對象：**

- 想快速體驗輕量休閒小遊戲的一般使用者
- 對 Next.js App Router、OAuth 登入、外部 API 串接有興趣的前端開發者
- 需要參考 PWA、主題切換、遊戲 UI 實作的開源貢獻者

---

## Features

- 🎮 **拉霸遊戲核心** — 三軸轉動、下注選擇、逐格揭示動畫，整合 `labag` 遊戲邏輯套件
- 🔐 **OAuth 登入** — 支援 Google、GitHub 第三方登入，含 Access / Refresh Token 自動刷新
- 🏆 **即時排行榜** — 依「總金幣數」與「轉動次數」分類排名，含頒獎台與完整榜單
- 🔗 **分享獎勵機制** — 登入用戶可產生分享連結，連結被點擊後可獲得金幣獎勵
- 🎨 **多主題切換** — 內建 Normal、SuperHHH、GreenWei、PiKaChu 等視覺主題
- 🔊 **音效與音樂設定** — 可獨立開關背景音樂與遊戲音效，設定持久化至 localStorage
- 📱 **PWA 支援** — 提供 Web App Manifest，可安裝至主畫面離線快捷啟動
- 📖 **遊戲說明頁** — 含開發歷程、符號賠率表、技術架構等 Markdown 內容

---

## Tech Stack

| 類別 | 技術 |
|------|------|
| 前端框架 | [Next.js 16](https://nextjs.org/)（App Router） |
| UI 函式庫 | [React 19](https://react.dev/) |
| 語言 | [TypeScript 5](https://www.typescriptlang.org/) |
| CSS / UI | [Tailwind CSS 4](https://tailwindcss.com/)、[Ant Design Icons](https://ant.design/components/icon) |
| 共用元件 | [`fanyucomponents`](https://www.npmjs.com/package/fanyucomponents) |
| API / 資料 | 外部 REST API（Supabase 後端），透過 `fetch` 封裝 |
| SEO | Next.js Metadata API、`sitemap.ts`、`robots.ts` |
| 部署 | [Vercel](https://vercel.com/) |

---

## Project Structure

```
labag-web/
├── public/
│   ├── manifest.json          # PWA 設定檔
│   └── icons/                 # App 圖示（192×192、512×512）
├── src/
│   ├── app/                   # Next.js App Router 路由頁面
│   │   ├── page.tsx           # 首頁
│   │   ├── game/              # 遊戲頁面
│   │   ├── rankings/          # 排行榜（含動態路由 [key]）
│   │   ├── login/             # 登入與 OAuth 回調
│   │   ├── about/             # 關於 / 遊戲說明
│   │   ├── share/             # 分享連結追蹤（middleware 重導向）
│   │   ├── layout.tsx         # 根 Layout 與 SEO Metadata
│   │   ├── sitemap.ts         # 動態 Sitemap 生成
│   │   └── robots.ts          # 搜尋引擎爬蟲設定
│   ├── components/            # React 元件
│   │   ├── game/              # 遊戲主畫面、轉軸、音效
│   │   ├── rankings/          # 排行榜 UI 元件
│   │   ├── Header/            # 導覽列（桌面 / 行動版）
│   │   └── ...                # 共用元件（AuthButton、ShareButton 等）
│   ├── contexts/              # React Context（User、Setting、Modal）
│   ├── hooks/                 # 自訂 Hooks
│   ├── libs/                  # 站點設定、環境變數、常數
│   ├── styles/                # 全域 CSS 與元件樣式
│   ├── types/                 # TypeScript 型別定義
│   ├── utils/                 # 工具函式（fetcher、backend API、audio）
│   └── middleware.ts          # 分享連結點擊追蹤 Middleware
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── eslint.config.mjs
```

### 重要目錄說明

| 目錄 | 用途 |
|------|------|
| `src/app/` | Next.js App Router 頁面與路由，每個資料夾對應一個 URL 路徑 |
| `src/components/` | 可複用的 React UI 元件，依功能模組分子目錄 |
| `src/contexts/` | 全域狀態管理（使用者登入、遊戲設定、Modal 控制） |
| `src/libs/` | 站點 metadata、路由定義、後端常數等靜態設定 |
| `src/utils/backend.tsx` | 後端 REST API 呼叫封裝（遊戲、使用者、排行榜、分享） |
| `src/middleware.ts` | 攔截 `/share/:id` 路徑，記錄點擊後重導向至首頁 |

---

## Getting Started

### 前置需求

- [Node.js](https://nodejs.org/) 18.17 或以上
- npm（或 yarn / pnpm / bun）

### 安裝與啟動

```bash
# 1. 複製專案
git clone https://github.com/<your-username>/labag-web.git
cd labag-web

# 2. 安裝依賴
npm install

# 3. 建立 .env.local 並設定環境變數（見下方 Environment Variables 章節）

# 4. 啟動開發伺服器
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 即可預覽。

### 其他指令

```bash
# 程式碼 Lint 檢查
npm run lint

# 建置 Production 版本
npm run build

# 啟動 Production 伺服器（需先 build）
npm run start
```

---

## Environment Variables

在專案根目錄建立 `.env.local` 檔案，並填入以下變數：

```env
# 後端 API 根 URL（必填）
# 開發環境可指向本地後端，Production 指向正式 API
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.example.com
```

| 變數名稱 | 必填 | 說明 |
|----------|------|------|
| `NEXT_PUBLIC_BACKEND_URL` | ✅ | 後端 REST API 的根 URL，前端所有 API 請求皆以此為 base |

> **注意：** 以 `NEXT_PUBLIC_` 為前綴的變數會暴露至瀏覽器端，請勿存放機密金鑰。

---

## Deployment

本專案預設部署於 [Vercel](https://vercel.com/)，正式環境網址：[https://labag.vercel.app](https://labag.vercel.app)

### Vercel 部署步驟

1. 將此 repository 連結至 Vercel 專案
2. 在 Vercel Dashboard → **Settings → Environment Variables** 中設定 `NEXT_PUBLIC_BACKEND_URL`
3. 推送至 main 分支，Vercel 將自動觸發 build 與部署

### 其他平台

亦可部署至任何支援 Next.js 的平台（如 Netlify、Railway、自架 Node.js 伺服器），只需確保：

- 執行 `npm run build` 後以 `npm run start` 啟動
- 環境變數 `NEXT_PUBLIC_BACKEND_URL` 已正確設定

---

## License

本專案以 [MIT License](LICENSE) 授權釋出。
