/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homiqtrends.com";

  // Static site paths
  const routes = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/categories",
    "/products",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/shipping-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  try {
    const supabase = createClient();
    
    // Fetch categories
    const { data: categories } = await supabase.from("categories").select("slug");
    const categoryRoutes = (categories || []).map((c: any) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: new Date().toISOString(),
    }));

    // Fetch products
    const { data: products } = await supabase.from("products").select("slug");
    const productRoutes = (products || []).map((p: any) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: new Date().toISOString(),
    }));

    return [...routes, ...categoryRoutes, ...productRoutes];
  } catch {
    return routes;
  }
}
