import { MetadataRoute } from "next";
import { site } from "@/libs/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["login", "/login/success"],
    },
    sitemap: `${site.url.origin}/sitemap.xml`,
  };
}
