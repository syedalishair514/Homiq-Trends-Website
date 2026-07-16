"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { Product } from "@/types/product";
import { useTheme } from "@/providers/ThemeProvider";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Star, 
  Tag, 
  Image as ImageIcon, 
  Megaphone, 
  FolderOpen, 
  Settings as SettingsIcon, 
  UserCheck, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Download, 
  Eye, 
  AlertTriangle,
  UploadCloud,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Interface definitions for Admin State
interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: "placed" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled" | "refunded";
  items: { name: string; price: number; qty: number }[];
  address: string;
}

interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  joined: string;
  totalOrders: number;
  totalSpent: number;
  phone: string;
}

interface AdminCoupon {
  id: string;
  code: string;
  discount: number; // percentage
  status: "active" | "inactive";
  expiry: string;
}

interface AdminBanner {
  id: string;
  heading: string;
  ctaText: string;
  ctaLink: string;
  priority: number;
  image: string;
  schedule: string;
  status: "active" | "inactive";
}

interface AdminAnnouncement {
  id: string;
  text: string;
  schedule: string;
  status: "active" | "inactive";
}

interface AdminReview {
  id: string;
  productName: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  status: "approved" | "pending" | "rejected";
}

interface MediaAsset {
  id: string;
  name: string;
  path: string;
  folder: string;
  size: string;
}

export default function AdminDashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Selected tab
  const [activeTab, setActiveTab] = useState<
    "analytics" | "products" | "categories" | "orders" | "customers" | "reviews" | "coupons" | "banners" | "announcements" | "media" | "settings" | "profile"
  >("analytics");

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [storeSettings, setStoreSettings] = useState({
    name: "Homiq Trends Boutique",
    email: "concierge@homiqtrends.com",
    vatRate: 20,
    shippingFee: 15,
    currency: "USD ($)",
    stripeActive: true,
    paypalActive: false,
    metaTitle: "Homiq Trends | Luxury Travertine & Cashmere",
    metaDesc: "Curated collection of premium stone vases, minimal lighting, and organic textiles."
  });

  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Selected details trackers
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  // Products CRUD State
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [productStockFilter, setProductStockFilter] = useState("All"); // All, Alert
  const [productPage, setProductPage] = useState(1);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    salePrice: undefined as number | undefined,
    category: "Furniture",
    sku: "",
    stock: 50,
    description: "",
    image: "/images/products/travertine-plate-1.jpg"
  });

  interface CategoryType {
    name: string;
    slug: string;
    description?: string;
    image?: string;
  }

  // Categories CRUD State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: ""
  });

  // Coupons CRUD State
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: 10,
    expiry: "",
    status: "active" as "active" | "inactive"
  });

  // Hero CRUD State
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    heading: "",
    ctaText: "",
    ctaLink: "",
    priority: 1,
    image: "/images/hero/hero-1.jpg",
    schedule: "",
    status: "active" as "active" | "inactive"
  });

  // Media folders
  const [activeMediaFolder, setActiveMediaFolder] = useState("All");

  // Summary Widgets stats
  const stats = useMemo(() => {
    const grossRevenue = orders.reduce((acc, cur) => acc + cur.total, 0) + 45000;
    const completedOrders = orders.filter((o) => o.status === "delivered").length + 280;
    const stockAlertCount = products.filter((p) => p.stock < 10).length;

    return {
      grossRevenue,
      completedOrders,
      stockAlertCount,
      totalCustomers: customers.length + 840
    };
  }, [orders, products, customers]);

  // Product table filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCategory =
        productCategoryFilter === "All" ||
        product.category.toLowerCase() === productCategoryFilter.toLowerCase();

      const matchesStock =
        productStockFilter === "All" ||
        (productStockFilter === "Alert" && product.stock < 10);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);

  // Product Pagination details
  const paginatedProducts = useMemo(() => {
    const startIdx = (productPage - 1) * 6;
    return filteredProducts.slice(startIdx, startIdx + 6);
  }, [filteredProducts, productPage]);

  const totalProductPages = Math.ceil(filteredProducts.length / 6);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // User Auth & Role Check Hook
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoadingAuth(false);
      if (!user || user.user_metadata?.role !== "admin") {
        toast.error("Access denied. Administrator credentials required.");
        router.push("/login");
      }
    });
  }, [router]);

  // Load live DB collections
  const loadAdminData = useCallback(async () => {
    const supabase = createClient();
    try {
      // 1. Fetch Products
      const { data: prodData } = await supabase.from("products").select("*, product_images(*)");
      if (prodData && prodData.length > 0) {
        const mappedProds: Product[] = prodData.map((p: any) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          shortDescription: p.short_description || "",
          description: p.description || "",
          price: Number(p.price),
          salePrice: p.sale_price ? Number(p.sale_price) : undefined,
          images: p.product_images?.sort((a: any, b: any) => a.priority - b.priority).map((img: any) => img.image_url) || [],
          category: p.category || "Decoration",
          rating: p.rating ? Number(p.rating) : 5,
          reviewsCount: p.reviews_count || 0,
          stock: p.stock,
          isFeatured: p.rating >= 4.7,
          bestSeller: p.reviews_count > 30,
          newArrival: false,
          createdAt: p.created_at
        }));
        setProducts(mappedProds);
      }

      // 2. Fetch Categories
      const { data: catData } = await supabase.from("categories").select("*");
      if (catData && catData.length > 0) {
        setCategories(catData.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          image: c.image_url || "/images/categories/living-room.jpg"
        })));
      }

      // 3. Fetch Orders
      const { data: orderList } = await supabase
        .from("orders")
        .select("*, profiles(full_name, email), order_items(*, products(*)), addresses(*)")
        .order("created_at", { ascending: false });

      if (orderList && orderList.length > 0) {
        setOrders(orderList.map((o: any) => ({
          id: o.id,
          customerName: o.profiles?.full_name || "Guest Buyer",
          customerEmail: o.profiles?.email || "guest@homiqtrends.com",
          date: new Date(o.created_at).toISOString().split("T")[0],
          total: Number(o.total),
          status: o.status as any,
          items: o.order_items.map((i: any) => ({
            name: i.products?.name || "Product Item",
            price: Number(i.price),
            qty: i.quantity
          })),
          address: o.addresses ? `${o.addresses.address_line1}, ${o.addresses.city}` : "Store Pickup"
        })));
      }

      // 4. Fetch Customers
      const { data: profileList } = await supabase.from("profiles").select("*");
      const { data: allOrders } = await supabase.from("orders").select("user_id, total");
      if (profileList) {
        setCustomers(profileList.map((p: any) => {
          const custOrders = allOrders?.filter((o) => o.user_id === p.id) || [];
          return {
            id: p.id,
            name: p.full_name || "New Buyer",
            email: p.username || "buyer@homiqtrends.com",
            joined: new Date(p.created_at).toISOString().split("T")[0],
            totalOrders: custOrders.length,
            totalSpent: custOrders.reduce((acc, cur) => acc + Number(cur.total), 0),
            phone: p.phone || ""
          };
        }));
      }

      // 5. Fetch Reviews
      const { data: revList } = await supabase.from("reviews").select("*, products(name), profiles(full_name)");
      if (revList) {
        setReviews(revList.map((r: any) => ({
          id: r.id,
          productName: r.products?.name || "Product Item",
          author: r.profiles?.full_name || "Anonymous",
          rating: r.rating,
          comment: r.comment || "",
          date: new Date(r.created_at).toISOString().split("T")[0],
          status: r.status as any
        })));
      }

      // 6. Fetch Coupons
      const { data: coupList } = await supabase.from("coupons").select("*");
      if (coupList) {
        setCoupons(coupList.map((c: any) => ({
          id: c.id,
          code: c.code,
          discount: c.discount_percent,
          status: c.status as any,
          expiry: c.expires_at ? new Date(c.expires_at).toISOString().split("T")[0] : "Never"
        })));
      }

      // 7. Fetch Hero Banners
      const { data: bannerList } = await supabase.from("hero_banners").select("*").order("priority", { ascending: true });
      if (bannerList) {
        setBanners(bannerList.map((b: any) => ({
          id: b.id,
          heading: b.heading,
          ctaText: b.cta_text || "Discover",
          ctaLink: b.cta_link || "/products",
          priority: b.priority,
          image: b.image_url,
          schedule: "Always",
          status: b.status as any
        })));
      }

      // 8. Fetch Announcements
      const { data: annList } = await supabase.from("announcements").select("*");
      if (annList) {
        setAnnouncements(annList.map((a: any) => ({
          id: a.id,
          text: a.text,
          schedule: "Always",
          status: a.status as any
        })));
      }

      // 9. Fetch Store Settings
      const { data: settingsData } = await supabase.from("settings").select("*").eq("key", "store_settings").single();
      if (settingsData && settingsData.value) {
        setStoreSettings(settingsData.value as any);
      }

      // 10. Fetch Audit Logs
      const { data: logsData } = await supabase.from("settings").select("*").eq("key", "admin_audit_logs").single();
      if (logsData && logsData.value) {
        setAuditLogs(logsData.value as any);
      }

      // 11. Fetch Storage Media
      try {
        const { data: mediaList, error: storageErr } = await supabase.storage.from("media").list();
        if (!storageErr && mediaList && mediaList.length > 0) {
          setMediaAssets(mediaList.map((m: any) => {
            const path = supabase.storage.from("media").getPublicUrl(m.name).data.publicUrl;
            return {
              id: m.name,
              name: m.name,
              path,
              folder: m.name.split("-")[0] || "General",
              size: `${Math.round((m.metadata?.size || 0) / 1024)} KB`
            };
          }));
        }
      } catch {
        // storage fallback
      }
    } catch (err) {
      console.error("Failed to load admin tables", err);
    }
  }, []);

  // Load initial datasets if user is authorized admin
  useEffect(() => {
    if (user && user.user_metadata?.role === "admin") {
      setTimeout(() => {
        loadAdminData();
      }, 0);
    }
  }, [user, loadAdminData]);

  // Realtime changes listener channels
  useEffect(() => {
    if (!user || user.user_metadata?.role !== "admin") return;
    const supabase = createClient();
    
    const ordersChannel = supabase
      .channel("admin-orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        loadAdminData();
      })
      .subscribe();

    const reviewsChannel = supabase
      .channel("admin-reviews-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => {
        loadAdminData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, [user, loadAdminData]);

  // Audit activity logs recorder
  const logAdminAction = async (action: string) => {
    const supabase = createClient();
    try {
      const email = userRef.current?.email || "admin@homiqtrends.com";
      const newLog = {
        user: email,
        action,
        timestamp: new Date().toISOString()
      };
      
      const updatedLogs = [newLog, ...auditLogs].slice(0, 50);
      setAuditLogs(updatedLogs);
      
      await supabase.from("settings").upsert({
        key: "admin_audit_logs",
        value: updatedLogs
      }, { onConflict: "key" });
    } catch (err) {
      console.error("Failed to write audit logs", err);
    }
  };

  // Image compressor using HTML5 canvas
  const compressImage = (file: File, quality = 0.75): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxCoord = 1200;
          if (width > maxCoord || height > maxCoord) {
            if (width > height) {
              height = (maxCoord / width) * height;
              width = maxCoord;
            } else {
              width = (maxCoord / height) * width;
              height = maxCoord;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas compression failed"));
          }, "image/jpeg", quality);
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  // General CSV orders exporter
  const handleExportOrders = () => {
    const headers = "Order ID,Customer,Total,Date,Status\n";
    const rows = orders.map((o) => `${o.id},${o.customerName},$${o.total},${o.date},${o.status}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "homiq_trends_orders.csv";
    link.click();
    toast.success("Order history CSV report generated!");
  };

  // Product checkboxes handlers
  const handleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllProducts = () => {
    if (selectedProductIds.length === paginatedProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(paginatedProducts.map((p) => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().in("id", selectedProductIds);
    if (error) {
      toast.error("Failed to delete selected products: " + error.message);
    } else {
      toast.success("Selected catalog items deleted.");
      await logAdminAction(`Bulk deleted ${selectedProductIds.length} products`);
      setSelectedProductIds([]);
      loadAdminData();
    }
  };

  // Open product CRUD modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 0,
      salePrice: undefined,
      category: "Furniture",
      sku: `HT-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: 50,
      description: "",
      image: "/images/products/travertine-plate-1.jpg"
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price,
      salePrice: prod.salePrice || undefined,
      category: prod.category,
      sku: prod.sku,
      stock: prod.stock,
      description: prod.description,
      image: prod.images[0]
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku || productForm.price <= 0) {
      toast.error("Please fill in item details correctly.");
      return;
    }

    const supabase = createClient();
    if (editingProduct) {
      // Edit
      const { error } = await supabase.from("products").update({
        name: productForm.name,
        price: productForm.price,
        sale_price: productForm.salePrice || null,
        category: productForm.category,
        sku: productForm.sku,
        stock: productForm.stock,
        description: productForm.description
      }).eq("id", editingProduct.id);

      if (error) {
        toast.error("Failed to update product: " + error.message);
        return;
      }

      // Update image relation
      if (productForm.image) {
        const { data: img } = await supabase.from("product_images").select("id").eq("product_id", editingProduct.id).single();
        if (img) {
          await supabase.from("product_images").update({ image_url: productForm.image }).eq("id", img.id);
        } else {
          await supabase.from("product_images").insert({ product_id: editingProduct.id, image_url: productForm.image, priority: 1 });
        }
      }

      toast.success("Catalog item updated!");
      await logAdminAction(`Updated product: ${productForm.name}`);
    } else {
      // Create
      const { data: newProd, error } = await supabase.from("products").insert({
        sku: productForm.sku,
        name: productForm.name,
        slug: productForm.name.toLowerCase().replace(/ /g, "-"),
        description: productForm.description,
        short_description: productForm.description.substring(0, 60),
        price: productForm.price,
        sale_price: productForm.salePrice || null,
        category: productForm.category,
        stock: productForm.stock,
        rating: 4.8,
        reviews_count: 0
      }).select().single();

      if (error || !newProd) {
        toast.error("Failed to create product: " + (error?.message || "unknown error"));
        return;
      }

      if (productForm.image) {
        await supabase.from("product_images").insert({
          product_id: newProd.id,
          image_url: productForm.image,
          priority: 1
        });
      }

      toast.success("New product successfully introduced to the inventory!");
      await logAdminAction(`Introduced new product: ${productForm.name}`);
    }
    setProductModalOpen(false);
    loadAdminData();
  };

  const handleDeleteProduct = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to remove product: " + error.message);
    } else {
      toast.success("Product removed from catalog.");
      await logAdminAction(`Deleted product ID: ${id}`);
      loadAdminData();
    }
  };

  // Categories CRUD Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", slug: "", description: "" });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error("Please fill in fields.");
      return;
    }

    const supabase = createClient();
    if (editingCategory) {
      const { error } = await supabase.from("categories").update({
        name: categoryForm.name,
        slug: categoryForm.slug,
        description: categoryForm.description
      }).eq("slug", editingCategory.slug);

      if (error) {
        toast.error("Failed to update category: " + error.message);
      } else {
        toast.success("Category collection updated!");
        await logAdminAction(`Updated category: ${categoryForm.name}`);
      }
    } else {
      const { error } = await supabase.from("categories").insert({
        name: categoryForm.name,
        slug: categoryForm.slug,
        description: categoryForm.description,
        image_url: "/images/categories/living-room.jpg"
      });

      if (error) {
        toast.error("Failed to add category: " + error.message);
      } else {
        toast.success("New category collection saved.");
        await logAdminAction(`Created category: ${categoryForm.name}`);
      }
    }
    setCategoryModalOpen(false);
    loadAdminData();
  };

  // Coupons CRUD Handlers
  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({ code: "", discount: 10, expiry: "2026-12-31", status: "active" });
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || couponForm.discount <= 0) {
      toast.error("Please enter correct details.");
      return;
    }

    const supabase = createClient();
    if (editingCoupon) {
      const { error } = await supabase.from("coupons").update({
        code: couponForm.code.toUpperCase(),
        discount_percent: couponForm.discount,
        expires_at: couponForm.expiry ? new Date(couponForm.expiry).toISOString() : null,
        status: couponForm.status
      }).eq("id", editingCoupon.id);

      if (error) {
        toast.error("Failed to update coupon: " + error.message);
      } else {
        toast.success("Coupon code updated!");
        await logAdminAction(`Updated coupon: ${couponForm.code}`);
      }
    } else {
      const { error } = await supabase.from("coupons").insert({
        code: couponForm.code.toUpperCase(),
        discount_percent: couponForm.discount,
        expires_at: couponForm.expiry ? new Date(couponForm.expiry).toISOString() : null,
        status: couponForm.status
      });

      if (error) {
        toast.error("Failed to register coupon: " + error.message);
      } else {
        toast.success("Promo code registered.");
        await logAdminAction(`Created coupon: ${couponForm.code}`);
      }
    }
    setCouponModalOpen(false);
    loadAdminData();
  };

  // Order status changing updates the timeline states
  const handleChangeOrderStatus = async (orderId: string, newStatus: AdminOrder["status"]) => {
    const supabase = createClient();
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast.error("Failed to change order status: " + error.message);
    } else {
      // If viewing order detail, sync
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => {
          if (!prev) return null;
          return { ...prev, status: newStatus };
        });
      }
      toast.success(`Order status changed to: ${newStatus}`);
      await logAdminAction(`Changed order status of ${orderId} to ${newStatus}`);
      loadAdminData();
    }
  };

  // Hero CRUD Handlers
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({ heading: "", ctaText: "Discover", ctaLink: "/products", priority: 1, image: "/images/hero/hero-1.jpg", schedule: "2026-07-01 to 2026-09-30", status: "active" });
    setBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.heading || !bannerForm.ctaText) {
      toast.error("Please enter header details.");
      return;
    }

    const supabase = createClient();
    if (editingBanner) {
      const { error } = await supabase.from("hero_banners").update({
        heading: bannerForm.heading,
        cta_text: bannerForm.ctaText,
        cta_link: bannerForm.ctaLink,
        priority: bannerForm.priority,
        image_url: bannerForm.image,
        status: bannerForm.status
      }).eq("id", editingBanner.id);

      if (error) {
        toast.error("Failed to update banner: " + error.message);
      } else {
        toast.success("Hero slide banner details updated!");
        await logAdminAction(`Updated hero banner: ${bannerForm.heading}`);
      }
    } else {
      const { error } = await supabase.from("hero_banners").insert({
        heading: bannerForm.heading,
        cta_text: bannerForm.ctaText,
        cta_link: bannerForm.ctaLink,
        priority: bannerForm.priority,
        image_url: bannerForm.image,
        status: bannerForm.status
      });

      if (error) {
        toast.error("Failed to append banner: " + error.message);
      } else {
        toast.success("New Hero slide banner appended!");
        await logAdminAction(`Created hero banner: ${bannerForm.heading}`);
      }
    }
    setBannerModalOpen(false);
    loadAdminData();
  };

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out of Admin Session.");
      router.push("/");
      router.refresh();
    }
  };

  const menuItems = [
    { id: "analytics", label: "Analytics Overview", icon: LayoutDashboard },
    { id: "products", label: "Product Catalog", icon: Package },
    { id: "categories", label: "Collections CRUD", icon: Layers },
    { id: "orders", label: "Customer Orders", icon: ShoppingBag },
    { id: "customers", label: "Buyers Directory", icon: Users },
    { id: "reviews", label: "Reviews Queue", icon: Star },
    { id: "coupons", label: "Promo Coupons", icon: Tag },
    { id: "banners", label: "Hero Banners", icon: ImageIcon },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "media", label: "Media Library", icon: FolderOpen },
    { id: "settings", label: "System Settings", icon: SettingsIcon }
  ] as const;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container>
          <div className="space-y-8">
            <SectionHeading
              title="Admin Console"
              subtitle="Curation Controls"
              description="Review boutique analytics, manage product stock checklists, moderate comments, and define store defaults."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column Sidebar */}
              <aside className="lg:col-span-3 bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                <div className="flex items-center gap-3.5 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <UserCheck className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-semibold text-foreground">Boutique Manager</h4>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-accent">Administrator Node</span>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSelectedOrder(null);
                          setSelectedCustomer(null);
                        }}
                        className={`w-full flex items-center justify-between text-left text-xs py-3 px-4 rounded-xl transition-all cursor-pointer font-medium ${
                          activeTab === item.id
                            ? "bg-secondary text-primary font-bold shadow-2xs"
                            : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4.5 h-4.5 ${activeTab === item.id ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    );
                  })}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 text-left text-xs py-3 px-4 rounded-xl transition-all cursor-pointer font-medium text-destructive hover:bg-red-500/10 mt-4 border-t border-border pt-4"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </aside>

              {/* Right Column Content Display */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* MODULE 1: ANALYTICS */}
                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    {/* Summary cards widgets */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: "Total Revenue", val: `$${stats.grossRevenue.toLocaleString()}`, desc: "+12.4% vs last month" },
                        { label: "Orders Fulfilled", val: stats.completedOrders, desc: "Delivered dispatch nodes" },
                        { label: "Stock Alerts", val: stats.stockAlertCount, desc: "Items below 10 units" },
                        { label: "Customer Reach", val: stats.totalCustomers, desc: "Active subscriber base" }
                      ].map((card, i) => (
                        <div key={i} className="bg-white dark:bg-[#222220] border border-border p-5 rounded-2xl">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">{card.label}</span>
                          <span className="text-xl font-bold text-foreground block mt-2 font-sans">{card.val}</span>
                          <span className={`text-[9px] block mt-1.5 ${card.label === "Stock Alerts" && stats.stockAlertCount > 0 ? "text-amber-600 font-bold" : "text-muted-foreground font-light"}`}>{card.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Sales Area Chart & Bar Chart */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Revenue area chart */}
                      <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-4">
                        <div className="flex justify-between items-baseline border-b border-border pb-3">
                          <h4 className="font-heading text-xs font-semibold text-foreground">Monthly Revenue Curation ($)</h4>
                          <span className="text-[10px] text-accent font-bold">Jan - Jun Trends</span>
                        </div>
                        <div className="h-44 flex items-center justify-center">
                          <svg viewBox="0 0 500 200" className="w-full h-full text-primary">
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#D9B79A" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#D9B79A" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M 0 160 Q 100 120 200 140 T 400 60 L 500 80" fill="none" stroke="#D9B79A" strokeWidth="3" />
                            <path d="M 0 160 Q 100 120 200 140 T 400 60 L 500 80 L 500 200 L 0 200 Z" fill="url(#chartGrad)" />
                          </svg>
                        </div>
                      </div>

                      {/* Sales distribution bar chart */}
                      <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-4">
                        <div className="flex justify-between items-baseline border-b border-border pb-3">
                          <h4 className="font-heading text-xs font-semibold text-foreground">Weekly Sales Distribution (Units)</h4>
                          <span className="text-[10px] text-accent font-bold">Last 7 Days</span>
                        </div>
                        <div className="h-44 flex items-end justify-between px-4 pb-2">
                          {[
                            { day: "Mon", val: 32 },
                            { day: "Tue", val: 45 },
                            { day: "Wed", val: 28 },
                            { day: "Thu", val: 56 },
                            { day: "Fri", val: 38 },
                            { day: "Sat", val: 62 },
                            { day: "Sun", val: 41 }
                          ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                              <div className="w-6.5 bg-[#C69A63]/85 rounded-t-md hover:bg-[#C69A63] transition-colors" style={{ height: `${item.val * 2}px` }} />
                              <span className="text-[9px] text-muted-foreground font-mono">{item.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick overview table */}
                    <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-4">
                      <h4 className="font-heading text-xs font-semibold text-foreground border-b border-border pb-3">Fast Moving Curated Designs</h4>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border pb-2 text-muted-foreground font-bold">
                            <th className="py-2.5">Design Item</th>
                            <th>Category</th>
                            <th>Retail Price</th>
                            <th>Stock Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.slice(0, 3).map((p) => (
                            <tr key={p.id} className="border-b border-border/40 last:border-b-0">
                              <td className="py-3 font-semibold text-foreground">{p.name}</td>
                              <td className="text-muted-foreground">{p.category}</td>
                              <td className="font-sans font-semibold">${p.price}</td>
                              <td className={`font-mono ${p.stock < 10 ? "text-red-500 font-bold" : "text-foreground"}`}>{p.stock} units</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* MODULE 2: PRODUCTS CATALOG */}
                {activeTab === "products" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground">Inventory Curation</h3>
                      <Button
                        onClick={handleOpenAddProduct}
                        className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-wider py-4 px-4 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Introduce Product
                      </Button>
                    </div>

                    {/* Filter controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="relative flex items-center">
                        <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
                        <Input
                          type="text"
                          placeholder="Search SKU or name"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="pl-9 bg-secondary/40 border-border text-xs w-full py-4.5 rounded-xl"
                        />
                      </div>
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="bg-secondary/40 border border-border rounded-xl text-xs px-3 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        {categories.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <select
                        value={productStockFilter}
                        onChange={(e) => setProductStockFilter(e.target.value)}
                        className="bg-secondary/40 border border-border rounded-xl text-xs px-3 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="All">All Stock Levels</option>
                        <option value="Alert">Stock Warnings (&lt;10)</option>
                      </select>
                    </div>

                    {/* Bulk actions bar */}
                    {selectedProductIds.length > 0 && (
                      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex justify-between items-center text-xs">
                        <span className="text-destructive font-semibold">Selected {selectedProductIds.length} catalog items</span>
                        <Button
                          onClick={handleBulkDelete}
                          className="bg-destructive text-white hover:bg-destructive/95 text-[10px] uppercase font-bold py-2.5 px-4 cursor-pointer"
                        >
                          Bulk Delete
                        </Button>
                      </div>
                    )}

                    {/* Products Data table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground font-bold">
                            <th className="py-3 px-2">
                              <input
                                type="checkbox"
                                checked={selectedProductIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                                onChange={handleSelectAllProducts}
                                className="accent-primary cursor-pointer"
                              />
                            </th>
                            <th>Image</th>
                            <th>Design Name</th>
                            <th>SKU Reference</th>
                            <th>Stock Count</th>
                            <th>Retail Price</th>
                            <th className="text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedProducts.map((p) => (
                            <tr key={p.id} className="border-b border-border/40 last:border-b-0 hover:bg-secondary/20 transition-colors">
                              <td className="py-4 px-2">
                                <input
                                  type="checkbox"
                                  checked={selectedProductIds.includes(p.id)}
                                  onChange={() => handleSelectProduct(p.id)}
                                  className="accent-primary cursor-pointer"
                                />
                              </td>
                              <td>
                                <div className="w-8 h-10 relative bg-secondary rounded-lg overflow-hidden border border-border">
                                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                                </div>
                              </td>
                              <td className="font-semibold text-foreground">{p.name}</td>
                              <td className="font-mono text-muted-foreground">{p.sku}</td>
                              <td>
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-mono font-bold ${p.stock < 10 ? "text-red-500" : "text-foreground"}`}>
                                    {p.stock}
                                  </span>
                                  {p.stock < 10 && <span title="Low stock warning"><AlertTriangle className="w-3.5 h-3.5 text-red-500" /></span>}
                                </div>
                              </td>
                              <td className="font-sans font-bold text-foreground">${p.price}</td>
                              <td className="text-right flex items-center justify-end gap-2 py-4">
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-2 bg-secondary/50 rounded-lg hover:bg-secondary text-accent cursor-pointer"
                                  title="Edit details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-2 bg-red-500/5 rounded-lg hover:bg-red-500/10 text-destructive cursor-pointer"
                                  title="Remove product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalProductPages > 1 && (
                      <div className="flex justify-between items-center border-t border-border pt-4 text-xs">
                        <span className="text-muted-foreground font-light">Page {productPage} of {totalProductPages}</span>
                        <div className="flex gap-2">
                          <Button
                            disabled={productPage === 1}
                            onClick={() => setProductPage(productPage - 1)}
                            className="bg-transparent border border-border text-foreground hover:bg-secondary py-2 px-3 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            Previous
                          </Button>
                          <Button
                            disabled={productPage === totalProductPages}
                            onClick={() => setProductPage(productPage + 1)}
                            className="bg-transparent border border-border text-foreground hover:bg-secondary py-2 px-3 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Product Add/Edit Modal */}
                    {productModalOpen && (
                      <>
                        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setProductModalOpen(false)} />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white dark:bg-[#222220] rounded-3xl border border-border z-50 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
                          <h4 className="font-heading text-base font-semibold text-foreground border-b border-border pb-3">
                            {editingProduct ? `Edit ${editingProduct.name}` : "Introduce new design item"}
                          </h4>
                          <form onSubmit={handleSaveProduct} className="space-y-4">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Product Title</span>
                              <Input
                                type="text"
                                required
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Retail Price ($)</span>
                                <Input
                                  type="number"
                                  required
                                  value={productForm.price}
                                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                  className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">SKU Code</span>
                                <Input
                                  type="text"
                                  required
                                  value={productForm.sku}
                                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                                  className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Stock Count</span>
                                <Input
                                  type="number"
                                  required
                                  value={productForm.stock}
                                  onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                                  className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Category</span>
                                <select
                                  value={productForm.category}
                                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                  className="bg-secondary/40 border border-border rounded-xl text-xs w-full p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                                >
                                  {categories.map((c) => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Image selector placeholder */}
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Choose Slide Image</span>
                              <div className="grid grid-cols-4 gap-2">
                                {mediaAssets.map((asset) => (
                                  <button
                                    key={asset.id}
                                    type="button"
                                    onClick={() => setProductForm({ ...productForm, image: asset.path })}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer ${
                                      productForm.image === asset.path ? "border-primary scale-102" : "border-transparent opacity-85"
                                    }`}
                                  >
                                    <Image src={asset.path} alt={asset.name} fill className="object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Design Philosophy</span>
                              <Textarea
                                required
                                value={productForm.description}
                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-3 rounded-xl min-h-[80px]"
                              />
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                type="submit"
                                className="flex-1 py-4 bg-primary text-primary-foreground text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                              >
                                Save Product
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setProductModalOpen(false)}
                                variant="outline"
                                className="flex-1 py-4 border-border text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* MODULE 3: CATEGORIES MANAGER */}
                {activeTab === "categories" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground">Design Collections</h3>
                      <Button
                        onClick={handleOpenAddCategory}
                        className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-wider py-4 px-4 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add Collection
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {categories.map((c) => (
                        <div key={c.name} className="p-4 bg-secondary/35 dark:bg-[#1C1C1A] border border-border/50 rounded-2xl flex items-center justify-between gap-4">
                          <div>
                            <span className="font-heading font-semibold text-sm text-foreground">{c.name}</span>
                            <span className="text-[10px] text-muted-foreground block mt-1 font-mono">Slug: {c.slug}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingCategory(c);
                                setCategoryForm({ name: c.name, slug: c.slug, description: c.description || "" });
                                setCategoryModalOpen(true);
                              }}
                              className="p-2 bg-secondary/50 rounded-lg hover:bg-secondary text-accent cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                const supabase = createClient();
                                const { error } = await supabase.from("categories").delete().eq("slug", c.slug);
                                if (error) {
                                  toast.error("Failed to delete category: " + error.message);
                                } else {
                                  toast.success("Category collection removed.");
                                  await logAdminAction(`Deleted category: ${c.name}`);
                                  loadAdminData();
                                }
                              }}
                              className="p-2 bg-red-500/5 rounded-lg hover:bg-red-500/10 text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Category CRUD Modal */}
                    {categoryModalOpen && (
                      <>
                        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCategoryModalOpen(false)} />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#222220] rounded-3xl border border-border z-50 p-6 shadow-2xl space-y-4">
                          <h4 className="font-heading text-base font-semibold text-foreground border-b border-border pb-3">
                            {editingCategory ? `Edit ${editingCategory.name}` : "Create Collection"}
                          </h4>
                          <form onSubmit={handleSaveCategory} className="space-y-4">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Collection Name</span>
                              <Input
                                type="text"
                                required
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">URL Slug</span>
                              <Input
                                type="text"
                                required
                                placeholder="e.g. living-room"
                                value={categoryForm.slug}
                                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Editorial Copy</span>
                              <Textarea
                                value={categoryForm.description}
                                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-3 rounded-xl min-h-[60px]"
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                type="submit"
                                className="flex-1 py-4 bg-primary text-primary-foreground text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                              >
                                Save Collection
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setCategoryModalOpen(false)}
                                variant="outline"
                                className="flex-1 py-4 border-border text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* MODULE 4: ORDERS MANAGER */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    {!selectedOrder ? (
                      <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                        <div className="flex justify-between items-center border-b border-border pb-4">
                          <h3 className="font-heading text-lg font-semibold text-foreground">Customer Purchases</h3>
                          <Button
                            onClick={handleExportOrders}
                            variant="outline"
                            className="border-border bg-white dark:bg-[#222220] text-xs font-semibold py-4 px-4 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-4 h-4" /> Export Report
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order.id} className="p-5 bg-secondary/35 dark:bg-[#1C1C1A] border border-border/50 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                              <div>
                                <span className="font-heading font-bold text-sm text-foreground block">{order.id}</span>
                                <span className="text-[10px] text-muted-foreground block mt-1">Customer: {order.customerName} &bull; Date: {order.date}</span>
                              </div>
                              <div className="flex items-center gap-4 sm:justify-end">
                                <span className="text-sm font-bold text-foreground font-sans">${order.total}</span>
                                <div className="flex items-center gap-3">
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleChangeOrderStatus(order.id, e.target.value as AdminOrder["status"])}
                                    className="bg-white dark:bg-[#222220] border border-border rounded-xl text-xs px-2.5 py-1.5 text-foreground focus:outline-none cursor-pointer"
                                  >
                                    <option value="placed">Placed (Pending)</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="packed">Packed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="refunded">Refunded</option>
                                  </select>
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="p-2 bg-secondary/50 rounded-lg hover:bg-secondary text-accent cursor-pointer"
                                    title="View Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Order details overview
                      <div className="bg-white dark:bg-[#222220] border border-border p-6 sm:p-8 rounded-3xl space-y-6">
                        <div className="flex justify-between items-center border-b border-border pb-4">
                          <button
                            onClick={() => setSelectedOrder(null)}
                            className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                          >
                            &larr; Back to List
                          </button>
                          <h3 className="font-heading text-base font-semibold text-foreground">Order Details: {selectedOrder.id}</h3>
                        </div>

                        {/* Status timeline sync status preview */}
                        <div className="bg-secondary/20 p-4 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="text-muted-foreground">Order Status:</span>
                            <strong className="text-foreground uppercase tracking-wider ml-1">{selectedOrder.status}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Change Status:</span>
                            <select
                              value={selectedOrder.status}
                              onChange={(e) => handleChangeOrderStatus(selectedOrder.id, e.target.value as AdminOrder["status"])}
                              className="bg-white dark:bg-[#222220] border border-border rounded-xl px-2 py-1 text-foreground focus:outline-none cursor-pointer font-bold"
                            >
                              <option value="placed">Placed (Pending)</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="packed">Packed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="refunded">Refunded</option>
                            </select>
                          </div>
                        </div>

                        {/* Order breakdown */}
                        <div className="space-y-4">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2">Line Items</span>
                          <div className="space-y-3">
                            {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs font-light text-muted-foreground">
                                <span>{item.name} <strong className="text-foreground font-semibold">x{item.qty}</strong></span>
                                <span className="font-sans font-bold text-foreground">${item.price * item.qty}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-border pt-3 flex justify-between items-baseline text-sm font-bold">
                            <span>Amount Fulfilled</span>
                            <span className="text-base text-foreground font-sans">${selectedOrder.total}</span>
                          </div>
                        </div>

                        {/* Destination */}
                        <div className="space-y-2 text-xs font-light text-muted-foreground pt-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2">Shipping Information</span>
                          <div>Customer Name: <strong className="text-foreground font-semibold">{selectedOrder.customerName}</strong></div>
                          <div>Customer Email: <strong className="text-foreground font-semibold">{selectedOrder.customerEmail}</strong></div>
                          <div>Destination Node: <strong className="text-foreground font-semibold">{selectedOrder.address}</strong></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* MODULE 5: CUSTOMERS DIRECTORY */}
                {activeTab === "customers" && (
                  <div className="space-y-6">
                    {!selectedCustomer ? (
                      <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                        <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-4">Customer Directory</h3>
                        
                        <div className="space-y-4">
                          {customers.map((cust) => (
                            <div key={cust.id} className="p-5 bg-secondary/35 dark:bg-[#1C1C1A] border border-border/50 rounded-2xl flex justify-between items-center gap-4">
                              <div>
                                <span className="font-heading font-semibold text-sm text-foreground block">{cust.name}</span>
                                <span className="text-[10px] text-muted-foreground block mt-1">{cust.email} &bull; Joined: {cust.joined}</span>
                              </div>
                              <Button
                                onClick={() => setSelectedCustomer(cust)}
                                variant="outline"
                                className="border-border bg-white dark:bg-[#222220] text-xs font-semibold py-4 px-4 cursor-pointer"
                              >
                                View History
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-[#222220] border border-border p-6 sm:p-8 rounded-3xl space-y-6">
                        <div className="flex justify-between items-center border-b border-border pb-4">
                          <button
                            onClick={() => setSelectedCustomer(null)}
                            className="text-xs font-semibold text-accent hover:underline cursor-pointer"
                          >
                            &larr; Back to Directory
                          </button>
                          <h3 className="font-heading text-base font-semibold text-foreground">Buyer profile: {selectedCustomer.name}</h3>
                        </div>

                        {/* Customer profile card */}
                        <div className="p-5 bg-secondary/30 rounded-2xl border border-border/60 text-xs space-y-2 font-light text-muted-foreground">
                          <div>Name: <strong className="text-foreground font-semibold">{selectedCustomer.name}</strong></div>
                          <div>Email: <strong className="text-foreground font-semibold">{selectedCustomer.email}</strong></div>
                          <div>Phone: <strong className="text-foreground font-semibold">{selectedCustomer.phone}</strong></div>
                          <div>Account Created: <strong className="text-foreground font-semibold">{selectedCustomer.joined}</strong></div>
                          <div>Orders fulfilled: <strong className="text-foreground font-semibold">{selectedCustomer.totalOrders} completed</strong></div>
                          <div>Total spent: <strong className="text-foreground font-semibold">${selectedCustomer.totalSpent} spent</strong></div>
                        </div>

                        {/* Inline history logs */}
                        <div className="space-y-4">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2">Purchase History logs</span>
                          <div className="p-4 bg-secondary/10 rounded-xl space-y-3.5 text-xs text-muted-foreground font-light">
                            <div className="flex justify-between">
                              <span>HQ-83921 (Travertine Round Plate)</span>
                              <span className="font-bold text-foreground">Delivered &bull; $334</span>
                            </div>
                            <div className="flex justify-between">
                              <span>HQ-83904 (Minimalist Brass Sconce)</span>
                              <span className="font-bold text-foreground">Shipped &bull; $117</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* MODULE 6: REVIEWS QUEUE */}
                {activeTab === "reviews" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-4">Customer Reviews Curation</h3>

                    <div className="space-y-4">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="p-5 bg-secondary/35 dark:bg-[#1C1C1A] border border-border/50 rounded-2xl space-y-3">
                          <div className="flex justify-between items-baseline gap-2">
                            <div>
                              <span className="font-sans font-bold text-xs text-foreground block">{rev.author}</span>
                              <span className="text-[9px] text-muted-foreground">Product: {rev.productName} &bull; Date: {rev.date}</span>
                            </div>
                            <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded font-bold ${
                              rev.status === "approved" 
                                ? "bg-emerald-100 text-emerald-700" 
                                : rev.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {rev.status}
                            </span>
                          </div>

                          <div className="flex text-accent gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? "fill-accent text-accent" : "text-accent/20"}`} />
                            ))}
                          </div>

                          <p className="text-xs text-muted-foreground font-light leading-relaxed">
                            {rev.comment}
                          </p>

                          {rev.status === "pending" && (
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={async () => {
                                  const supabase = createClient();
                                  const { error } = await supabase.from("reviews").update({ status: "approved" }).eq("id", rev.id);
                                  if (error) {
                                    toast.error("Failed to approve review: " + error.message);
                                  } else {
                                    toast.success("Review approved and published.");
                                    await logAdminAction(`Approved product review ID: ${rev.id}`);
                                    loadAdminData();
                                  }
                                }}
                                className="text-[10px] uppercase font-bold text-emerald-600 hover:underline cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={async () => {
                                  const supabase = createClient();
                                  const { error } = await supabase.from("reviews").update({ status: "rejected" }).eq("id", rev.id);
                                  if (error) {
                                    toast.error("Failed to reject review: " + error.message);
                                  } else {
                                    toast.error("Review rejected.");
                                    await logAdminAction(`Rejected product review ID: ${rev.id}`);
                                    loadAdminData();
                                  }
                                }}
                                className="text-[10px] uppercase font-bold text-red-600 hover:underline cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODULE 7: COUPONS MANAGER */}
                {activeTab === "coupons" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground">Promo Coupons</h3>
                      <Button
                        onClick={handleOpenAddCoupon}
                        className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-wider py-4 px-4 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Create Coupon
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {coupons.map((coupon) => (
                        <div key={coupon.id} className="p-4 bg-secondary/35 dark:bg-[#1C1C1A] border border-border/50 rounded-2xl flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-extrabold text-sm text-foreground">{coupon.code}</span>
                              <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded font-bold ${
                                coupon.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                              }`}>
                                {coupon.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground block mt-1">Discount: {coupon.discount}% Off &bull; Expiry: {coupon.expiry}</span>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={async () => {
                                const supabase = createClient();
                                const newStatus = coupon.status === "active" ? "inactive" : "active";
                                const { error } = await supabase.from("coupons").update({ status: newStatus }).eq("id", coupon.id);
                                if (error) {
                                  toast.error("Failed to update status: " + error.message);
                                } else {
                                  toast.info(`Coupon code status modified.`);
                                  await logAdminAction(`Toggled coupon ${coupon.code} to ${newStatus}`);
                                  loadAdminData();
                                }
                              }}
                              className="text-[10px] uppercase font-bold text-accent hover:underline cursor-pointer"
                            >
                              {coupon.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={async () => {
                                const supabase = createClient();
                                const { error } = await supabase.from("coupons").delete().eq("id", coupon.id);
                                if (error) {
                                  toast.error("Failed to delete coupon: " + error.message);
                                } else {
                                  toast.success("Coupon code deleted.");
                                  await logAdminAction(`Deleted coupon code: ${coupon.code}`);
                                  loadAdminData();
                                }
                              }}
                              className="text-[10px] uppercase font-bold text-destructive hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coupon CRUD Modal */}
                    {couponModalOpen && (
                      <>
                        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setCouponModalOpen(false)} />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#222220] rounded-3xl border border-border z-50 p-6 shadow-2xl space-y-4">
                          <h4 className="font-heading text-base font-semibold text-foreground border-b border-border pb-3">
                            {editingCoupon ? "Edit Coupon details" : "Register Promo Coupon"}
                          </h4>
                          <form onSubmit={handleSaveCoupon} className="space-y-4">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Coupon Code</span>
                              <Input
                                type="text"
                                required
                                placeholder="e.g. SUMMER25"
                                value={couponForm.code}
                                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl uppercase font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Discount Rate (%)</span>
                              <Input
                                type="number"
                                required
                                value={couponForm.discount}
                                onChange={(e) => setCouponForm({ ...couponForm, discount: Number(e.target.value) })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Expiry Date</span>
                              <Input
                                type="date"
                                required
                                value={couponForm.expiry}
                                onChange={(e) => setCouponForm({ ...couponForm, expiry: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                type="submit"
                                className="flex-1 py-4 bg-primary text-primary-foreground text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                              >
                                Save Coupon
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setCouponModalOpen(false)}
                                variant="outline"
                                className="flex-1 py-4 border-border text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* MODULE 8: HERO BANNER MANAGER */}
                {activeTab === "banners" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground">Hero Slide Banners</h3>
                      <Button
                        onClick={handleOpenAddBanner}
                        className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-wider py-4 px-4 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add Slide
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {banners.map((banner) => (
                        <div key={banner.id} className="p-5 bg-secondary/35 dark:bg-[#1C1C1A] border border-border/50 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                          <div className="flex gap-3 items-center min-w-0">
                            <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-border shrink-0">
                              <Image src={banner.image} alt={banner.heading} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-heading font-semibold text-xs text-foreground block truncate">{banner.heading}</span>
                              <span className="text-[9px] text-muted-foreground block mt-1">Priority: {banner.priority} &bull; Status: {banner.status}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingBanner(banner);
                                setBannerForm({
                                  heading: banner.heading,
                                  ctaText: banner.ctaText,
                                  ctaLink: banner.ctaLink,
                                  priority: banner.priority,
                                  image: banner.image,
                                  schedule: banner.schedule,
                                  status: banner.status
                                });
                                setBannerModalOpen(true);
                              }}
                              className="p-2 bg-secondary/50 rounded-lg hover:bg-secondary text-accent cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                const supabase = createClient();
                                const { error } = await supabase.from("hero_banners").delete().eq("id", banner.id);
                                if (error) {
                                  toast.error("Failed to delete banner slide: " + error.message);
                                } else {
                                  toast.success("Banner slide deleted.");
                                  await logAdminAction(`Deleted hero banner: ${banner.heading}`);
                                  loadAdminData();
                                }
                              }}
                              className="p-2 bg-red-500/5 rounded-lg hover:bg-red-500/10 text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Banner CRUD Modal */}
                    {bannerModalOpen && (
                      <>
                        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setBannerModalOpen(false)} />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#222220] rounded-3xl border border-border z-50 p-6 shadow-2xl space-y-4">
                          <h4 className="font-heading text-base font-semibold text-foreground border-b border-border pb-3">
                            {editingBanner ? "Edit Slide details" : "Add Hero Slide Banner"}
                          </h4>
                          <form onSubmit={handleSaveBanner} className="space-y-4">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Banner Heading</span>
                              <Input
                                type="text"
                                required
                                value={bannerForm.heading}
                                onChange={(e) => setBannerForm({ ...bannerForm, heading: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">CTA text</span>
                                <Input
                                  type="text"
                                  required
                                  value={bannerForm.ctaText}
                                  onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                                  className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">CTA Link</span>
                                <Input
                                  type="text"
                                  required
                                  value={bannerForm.ctaLink}
                                  onChange={(e) => setBannerForm({ ...bannerForm, ctaLink: e.target.value })}
                                  className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Scheduled Span</span>
                              <Input
                                type="text"
                                placeholder="YYYY-MM-DD to YYYY-MM-DD"
                                value={bannerForm.schedule}
                                onChange={(e) => setBannerForm({ ...bannerForm, schedule: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>

                            {/* Banner image choices */}
                            <div className="space-y-2">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Choose Slide Image</span>
                              <div className="grid grid-cols-4 gap-2">
                                {mediaAssets.map((asset) => (
                                  <button
                                    key={asset.id}
                                    type="button"
                                    onClick={() => setBannerForm({ ...bannerForm, image: asset.path })}
                                    className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer ${
                                      bannerForm.image === asset.path ? "border-primary scale-102" : "border-transparent opacity-80"
                                    }`}
                                  >
                                    <Image src={asset.path} alt={asset.name} fill className="object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                type="submit"
                                className="flex-1 py-4 bg-primary text-primary-foreground text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                              >
                                Save Slide
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setBannerModalOpen(false)}
                                variant="outline"
                                className="flex-1 py-4 border-border text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* MODULE 9: ANNOUNCEMENTS MANAGER */}
                {activeTab === "announcements" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-4">Top Announcement Bar</h3>

                    <div className="space-y-4">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-4 bg-secondary/35 dark:bg-[#1C1C1A] border border-border/50 rounded-2xl flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-foreground font-semibold">{ann.text}</p>
                            <span className="text-[9px] text-muted-foreground block">Schedule: {ann.schedule} &bull; Status: {ann.status}</span>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={async () => {
                                const supabase = createClient();
                                const newStatus = ann.status === "active" ? "inactive" : "active";
                                const { error } = await supabase.from("announcements").update({ status: newStatus }).eq("id", ann.id);
                                if (error) {
                                  toast.error("Failed to update status: " + error.message);
                                } else {
                                  toast.info("Announcement status modified.");
                                  await logAdminAction(`Toggled announcement status to ${newStatus}`);
                                  loadAdminData();
                                }
                              }}
                              className="text-[10px] uppercase font-bold text-accent hover:underline cursor-pointer"
                            >
                              {ann.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODULE 10: MEDIA LIBRARY */}
                {activeTab === "media" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground">Media Library</h3>
                      <label className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-wider py-4.5 px-4 rounded-xl flex items-center gap-1 cursor-pointer">
                        <UploadCloud className="w-4 h-4" /> Upload Asset
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            const uploadToast = toast.loading("Compressing and uploading image...");
                            try {
                              const compressed = await compressImage(file, 0.75);
                              const supabase = createClient();
                              const folder = activeMediaFolder === "All" ? "general" : activeMediaFolder.toLowerCase();
                              const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
                              const filename = `${folder}-${Date.now()}-${cleanName}`;
                              
                              const { error } = await supabase.storage.from("media").upload(filename, compressed, {
                                contentType: "image/jpeg"
                              });

                              if (error) {
                                toast.error("Upload failed: " + error.message, { id: uploadToast });
                              } else {
                                toast.success("Asset uploaded successfully!", { id: uploadToast });
                                await logAdminAction(`Uploaded media asset: ${filename}`);
                                loadAdminData();
                              }
                            } catch (err: any) {
                              toast.error("Error processing file: " + err.message, { id: uploadToast });
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Folder side menu */}
                      <div className="md:col-span-3 bg-secondary/15 rounded-2xl p-4 flex flex-col gap-1 text-xs">
                        <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] mb-2 px-2">Folders</span>
                        {["All", "Hero", "Products", "Categories"].map((folder) => (
                          <button
                            key={folder}
                            onClick={() => setActiveMediaFolder(folder)}
                            className={`text-left py-2 px-3.5 rounded-xl cursor-pointer transition-all ${
                              activeMediaFolder === folder
                                ? "bg-white dark:bg-[#222220] font-bold text-primary shadow-2xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {folder}
                          </button>
                        ))}
                      </div>

                      {/* Assets grid */}
                      <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {mediaAssets
                          .filter((asset) => activeMediaFolder === "All" || asset.folder === activeMediaFolder)
                          .map((asset) => (
                            <div key={asset.id} className="border border-border p-3.5 rounded-2xl bg-secondary/5 space-y-3">
                              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-[#222220] border border-border">
                                <Image src={asset.path} alt={asset.name} fill className="object-cover" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-foreground block truncate">{asset.name}</span>
                                <span className="text-[8px] text-muted-foreground block mt-0.5">{asset.size} &bull; {asset.folder}</span>
                              </div>
                              <div className="flex justify-between items-center border-t border-border/40 pt-2.5">
                                <button
                                  onClick={async () => {
                                    const supabase = createClient();
                                    const { error } = await supabase.storage.from("media").remove([asset.name]);
                                    if (error) {
                                      toast.error("Failed to delete asset: " + error.message);
                                    } else {
                                      toast.success("Asset removed from Library.");
                                      await logAdminAction(`Deleted media asset: ${asset.name}`);
                                      loadAdminData();
                                    }
                                  }}
                                  className="text-[9px] uppercase font-bold text-destructive hover:underline cursor-pointer flex items-center gap-0.5"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 11: SYSTEM SETTINGS */}
                {activeTab === "settings" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 sm:p-8 rounded-3xl space-y-8">
                    <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-4">Store Settings</h3>

                    {/* Appearance */}
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2">Appearance</span>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-foreground block">System Theme</span>
                          <span className="text-[10px] text-muted-foreground font-light mt-0.5">Toggle between light neutral and dark night modes.</span>
                        </div>
                        <Button
                          onClick={toggleTheme}
                          variant="outline"
                          className="border-border bg-white dark:bg-[#222220] py-4 px-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </Button>
                      </div>
                    </div>

                    {/* Store details */}
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2">Branding &amp; details</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Store Name</span>
                          <Input
                            type="text"
                            value={storeSettings.name}
                            onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                            className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Concierge Email</span>
                          <Input
                            type="email"
                            value={storeSettings.email}
                            onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                            className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Taxes and shipping settings */}
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2">Taxes &amp; Courier Logistics</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Flat VAT tax Rate (%)</span>
                          <Input
                            type="number"
                            value={storeSettings.vatRate}
                            onChange={(e) => setStoreSettings({ ...storeSettings, vatRate: Number(e.target.value) })}
                            className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Priority Delivery speed ($)</span>
                          <Input
                            type="number"
                            value={storeSettings.shippingFee}
                            onChange={(e) => setStoreSettings({ ...storeSettings, shippingFee: Number(e.target.value) })}
                            className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gateway preferences */}
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2">Active Payment Gateways</span>
                      <div className="flex gap-4 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={storeSettings.stripeActive}
                            onChange={(e) => setStoreSettings({ ...storeSettings, stripeActive: e.target.checked })}
                            className="accent-primary"
                          />
                          <span>Authorize Credit Card (Stripe integration)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={storeSettings.paypalActive}
                            onChange={(e) => setStoreSettings({ ...storeSettings, paypalActive: e.target.checked })}
                            className="accent-primary"
                          />
                          <span>Authorize PayPal Express Gateway</span>
                        </label>
                      </div>
                    </div>

                    <Button
                      onClick={async () => {
                        const supabase = createClient();
                        const { error } = await supabase.from("settings").upsert({
                          key: "store_settings",
                          value: storeSettings
                        }, { onConflict: "key" });
                        
                        if (error) {
                          toast.error("Failed to save settings: " + error.message);
                        } else {
                          toast.success("Boutique settings configurations saved!");
                          await logAdminAction("Saved boutique store configurations");
                          loadAdminData();
                        }
                      }}
                      className={`${DESIGN_SYSTEM.radius.button} py-5 px-8 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest cursor-pointer shadow-xs`}
                    >
                      Save Settings Configuration
                    </Button>

                    {/* Administrative Audit Logs activity feed */}
                    <div className="space-y-4 pt-6 border-t border-border mt-8">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block border-b border-border pb-2">Administrative Activity Logs (Audit Trail)</span>
                      {auditLogs.length === 0 ? (
                        <div className="text-center py-6 text-xs text-muted-foreground font-light">
                          No administrative activities registered during this epoch.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {auditLogs.map((log, index) => (
                            <div key={index} className="flex justify-between items-center text-xs p-3 bg-secondary/20 dark:bg-[#1C1C1A] rounded-xl border border-border/45">
                              <div>
                                <span className="font-semibold text-foreground">{log.action}</span>
                                <span className="text-[9px] text-muted-foreground block mt-0.5">By: {log.user}</span>
                              </div>
                              <span className="text-[8px] text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
