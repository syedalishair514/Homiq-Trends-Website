import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../constants/products";
import { CATEGORIES } from "../constants/categories";
import fs from "fs";
import path from "path";

// 1. Manually parse .env.local variables
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf-8");
  envFile.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function seed() {
  console.log("Seeding categories...");
  for (const cat of CATEGORIES) {
    const uuid = `c1b00000-0000-0000-0000-${cat.id.replace("cat-", "").padStart(12, "0")}`;
    const { error } = await supabase.from("categories").upsert({
      id: uuid,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image_url: cat.image
    }, { onConflict: "slug" });
    
    if (error) {
      console.error("Error seeding category:", cat.name, error.message);
    }
  }

  console.log("Seeding products and image galleries...");
  for (const prod of PRODUCTS) {
    const uuid = `a7b00000-0000-0000-0000-${prod.id.replace("prod-", "").padStart(12, "0")}`;

    const { error: prodError } = await supabase.from("products").upsert({
      id: uuid,
      category: prod.category,
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      short_description: prod.shortDescription,
      price: prod.price,
      sale_price: prod.salePrice || null,
      sku: prod.sku,
      stock: prod.stock,
      rating: prod.rating || 5.0,
      reviews_count: prod.reviewsCount || 0
    }, { onConflict: "slug" });

    if (prodError) {
      console.error("Error seeding product:", prod.name, prodError.message);
      continue;
    }

    // Delete existing images to avoid duplicates and reinsert
    await supabase.from("product_images").delete().eq("product_id", uuid);

    for (let i = 0; i < prod.images.length; i++) {
      const { error: imgError } = await supabase.from("product_images").insert({
        product_id: uuid,
        image_url: prod.images[i],
        priority: i
      });
      if (imgError) {
        console.error("Error seeding image for product:", prod.name, imgError.message);
      }
    }
  }

  // 3. Seed Banners
  console.log("Seeding default hero banners...");
  const bannerImages = [
    "/images/hero/hero-slide-1.jpg",
    "/images/hero/hero-slide-2.jpg",
    "/images/hero/hero-slide-3.jpg"
  ];
  for (let i = 1; i <= 3; i++) {
    const { error } = await supabase.from("hero_banners").upsert({
      id: `b2b00000-0000-0000-0000-00000000000${i}`,
      heading: i === 1 ? "Curated Premium Living" : i === 2 ? "Artisanal Textures" : "Sculptural Lighting Structures",
      cta_text: "Discover Catalog",
      cta_link: "/products",
      priority: i,
      image_url: bannerImages[i - 1],
      status: "active"
    }, { onConflict: "id" });
    if (error) console.error("Error seeding banner:", error.message);
  }

  // 4. Seed Announcements
  console.log("Seeding announcement bars...");
  const { error: announceErr } = await supabase.from("announcements").upsert({
    id: "a1a00000-0000-0000-0000-000000000001",
    text: "Complimentary global delivery on premium orders over $150",
    status: "active"
  }, { onConflict: "id" });
  if (announceErr) console.error("Error seeding announcement:", announceErr.message);

  console.log("Database seeding completed successfully!");
}

seed();
