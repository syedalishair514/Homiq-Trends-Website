import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homiqtrends.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/profile", "/checkout/success", "/checkout/failed"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
