import { site } from "@/libs/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於",
  description: `關於 ${site.title} - ${site.description}`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "關於",
    description: `關於 ${site.title} - ${site.description}`,
    url: "/about",
  },
};

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
