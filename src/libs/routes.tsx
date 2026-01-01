import { HomeOutlined, TrophyOutlined, UserOutlined } from "@ant-design/icons";

export const routes: {
  label: string;
  href: string;
  icon: React.ElementType;
  isActive?: (path: string) => boolean;
  needsAuth?: boolean;
}[] = [
  {
    label: "首頁",
    href: "/",
    isActive: (path: string) => path === "/",
    icon: HomeOutlined,
  },
  {
    label: "排行榜",
    href: "/ranking",
    icon: TrophyOutlined,
  },
  {
    label: "個人資料",
    href: "/profile",
    icon: UserOutlined,
  },
];
