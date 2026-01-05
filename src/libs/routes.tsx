import { HomeOutlined, TrophyOutlined } from "@ant-design/icons";
import { statsLabels, VALID_KEYS } from "./backend";

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
      label: statsLabels[key],
      href: `/${key}`,
    })),
  },
];
