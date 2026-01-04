import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { ModesProvider } from "@/contexts/ModesContext";
import { Body } from "@/components/Body";
import { site } from "@/libs/site";
import { SettingProvider } from "@/contexts/SettingContext";
import { PatternModalProvider } from "@/contexts/PatternModalContext";
import { ModeModalProvider } from "@/contexts/ModeModalContext";
import { SettingButton } from "@/components/SettingButton";
import { UserProvider } from "@/contexts/UserContext";
import { UserModalProvider } from "@/contexts/UserModalContext";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: site.url,
  title: site.title,
  description: site.description,
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",

  authors: [
    { name: "范余" },
    { name: "范余振富" },
    { name: "飯魚" },
    { name: "飯魚正負" },
  ],
  keywords: [
    "啦八機",
    "雞巴啦",
    "機八啦",
    "LaBaG",
    "LABAG",
    "labag",
    "超級阿禾",
    "陳敬禾",
    "阿禾",
    "SuperHHH",
    "綠光阿瑋",
    "GreenWei",
    "皮卡丘",
    "PiKaChu",
    "拉霸機",
    "吃角子老虎機",
    "角子機",
    "范余",
    "飯魚",
    "范余振富",
    "飯魚正負",
  ],

  openGraph: {
    title: "啦八機 LaBaG",
    description: "只需動動手指就能在無聊時候打發時間的小遊戲",
    url: "https://labag.vercel.app",
    siteName: "啦八機 LaBaG",
    locale: "zh-TW",
    images: [
      {
        url: "/favicon.ico", // 分享時顯示的圖片
        width: 600,
        height: 600,
        alt: "LaBaG Logo",
      },
    ],
    type: "website",
  },

  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <ModesProvider>
          <Body>
            <UserModalProvider>
              <PatternModalProvider>
                <ModeModalProvider>
                  <SettingProvider>
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="manifest" href="/manifest.json" />
                    <Header />
                    <main>{children}</main>
                    <SettingButton className="fixed bottom-4 right-4 z-49 text-xl md:text-2xl lg:text-3xl" />
                  </SettingProvider>
                </ModeModalProvider>
              </PatternModalProvider>
            </UserModalProvider>
          </Body>
        </ModesProvider>
      </UserProvider>
    </html>
  );
}
