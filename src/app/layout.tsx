import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Body } from "@/components/Body";
import { site } from "@/libs/site";
import { SettingProvider } from "@/contexts/SettingContext";
import { PatternModalProvider } from "@/contexts/PatternModalContext";
import { SettingButton } from "@/components/SettingButton";
import { UserProvider } from "@/contexts/UserContext";
import { UserModalProvider } from "@/contexts/UserModalContext";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { DownloadOutlined } from "@ant-design/icons";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: site.url,
  title: { default: site.title, template: `%s | ${site.title}` },
  description: site.description,
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",

  authors: [
    { name: "范余", url: "https://github.com/fanyuuu2006" },
    { name: "范余振富", url: "https://github.com/fanyuuu2006" },
    { name: "飯魚", url: "https://github.com/fanyuuu2006" },
    { name: "飯魚正負", url: "https://github.com/fanyuuu2006" },
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
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "LaBaG Logo",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "啦八機 LaBaG",
    description: "只需動動手指就能在無聊時候打發時間的小遊戲",
    images: ["/icons/icon-512x512.png"],
  },

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  verification: {
    google: "BPwLDvPkjbND-Djvxq812SdYkm2pHQ18WPWt2KkPiQk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Body className="flex min-h-screen flex-col">
        <UserProvider>
          <UserModalProvider>
            <SettingProvider>
              <PatternModalProvider>
                <Header className="sticky top-0 z-50" />
                <main className="h-full w-full overflow-y-auto">
                  {children}
                </main>
                <SettingButton className="fixed bottom-4 right-4 z-49" />
                <InstallPWAButton className="btn flex items-center justify-center p-2 rounded-full fixed bottom-4 left-4 z-49">
                  <DownloadOutlined className="text-xl" />
                </InstallPWAButton>
              </PatternModalProvider>
            </SettingProvider>
          </UserModalProvider>
        </UserProvider>
      </Body>
    </html>
  );
}
