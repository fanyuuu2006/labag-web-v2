import { MetadataRoute } from "next";
import { site, routes as siteRoutes } from "@/libs/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = siteRoutes.flatMap((route) => {
    const parent = route.href;
    const children =
      route.subRoutes?.map((sub) => {
        // 處理路徑拼接，避免雙重斜線 (//)
        return parent === "/" ? sub.href : `${parent}${sub.href}`;
      }) || [];

    return [parent, ...children];
  });

  // 確保 /game 被包含 (如果不在此列表中)
  if (!routes.includes("/game")) {
    routes.push("/game");
  }

  // 移除重複路徑
  const uniqueRoutes = Array.from(new Set(routes));

  return uniqueRoutes.map((route) => ({
    url: `${site.url.origin}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "/" ? 1 : 0.8,
  }));
}
