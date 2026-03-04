import { MetadataRoute } from "next";
import { site } from "@/libs/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login-success", "/gameover"],
    },
    sitemap: `${site.url.origin}/sitemap.xml`,
  };
}
