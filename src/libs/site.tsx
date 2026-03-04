import { HomeOutlined, TrophyOutlined } from "@ant-design/icons";
import { VALID_KEYS } from "./backend";
import { statsData } from "./rankings";

export const site = {
  title: "啦八機 LaBaG",
  description: "只需動動手指就能在無聊時候打發時間的小遊戲",
  url: new URL("https://labag.vercel.app"),
} as const;

type BaseRoute = {
  label: string;
  href: string;
  icon?: React.ElementType;
  isActive?: (path: string) => boolean;
};
export interface RootRoute extends BaseRoute {
  subRoutes?: BaseRoute[];
}
export const routes: RootRoute[] = [
  {
    label: "首頁",
    href: "/",
    isActive: (path: string) => path === "/",
    icon: HomeOutlined,
  },
  {
    label: "排行榜",
    href: "/rankings",
    icon: TrophyOutlined,
    subRoutes: VALID_KEYS.map((key) => ({
      label: statsData[key].label,
      href: `/${key}`,
    })),
  },
];
