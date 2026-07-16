"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useTheme } from "@/providers/ThemeProvider";
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Heart, 
  Bell, 
  Settings, 
  ShieldAlert, 
  Trash2, 
  Plus, 
  Check, 
  Edit3, 
  Download, 
  Clock, 
  Truck, 
  PackageCheck,
  Moon,
  Sun,
  Globe,
  Lock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Product } from "@/types/product";

// Mock database structures for the user session
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  status: "delivered" | "shipped" | "processing" | "placed";
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  address: string;
}

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface SystemNotification {
  id: string;
  title: string;
  description: string;
  date: string;
  unread: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { theme, toggleTheme } = useTheme();

  // Active view tab state
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "orders" | "addresses" | "wishlist" | "notifications" | "settings">("overview");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: "Eleanor",
    lastName: "Vance",
    email: "eleanor.v@homiqtrends.com",
    phone: "+44 7911 123456",
    birthday: "1994-08-12",
    avatar: "/images/testimonials/avatar-1.jpg" // Fallback fallback avatar representation
  });

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      name: "Main Residence",
      street: "105 Kensington High St",
      city: "London, W8 5SF",
      country: "United Kingdom",
      phone: "+44 7911 123456",
      isDefault: true
    },
    {
      id: "addr-2",
      name: "Holiday Flat",
      street: "Via della Moscova 24",
      city: "Milan, 20121",
      country: "Italy",
      phone: "+39 02 1234 5678",
      isDefault: false
    }
  ]);

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    street: "",
    city: "",
    country: "",
    phone: "",
    isDefault: false
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "HQ-83921",
      status: "delivered",
      date: "July 10, 2026",
      address: "105 Kensington High St, London",
      items: [
        { id: "item-1", name: "Travertine Round Plate", price: 85, quantity: 2, image: "/images/products/travertine-plate-1.jpg" },
        { id: "item-2", name: "Cashmere Organic Blanket", price: 164, quantity: 1, image: "/images/products/blanket-1.jpg" }
      ],
      subtotal: 334,
      shipping: 0,
      discount: 0,
      total: 334
    },
    {
      id: "HQ-83904",
      status: "shipped",
      date: "July 08, 2026",
      address: "105 Kensington High St, London",
      items: [
        { id: "item-3", name: "Minimalist Brass Sconce", price: 120, quantity: 1, image: "/images/products/lamp-1.jpg" }
      ],
      subtotal: 120,
      shipping: 15,
      discount: 18,
      total: 117
    }
  ]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // System Notifications
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "notif-1",
      title: "Artisan Order Dispatched",
      description: "Your order #HQ-83904 has left our warehouse in Venice and is currently en route.",
      date: "2 hours ago",
      unread: true
    },
    {
      id: "notif-2",
      title: "15% Trade Voucher Applied",
      description: "Welcome to Homiq Trends club. Save 15% using coupon code HOMIQ15 at your checkout bag.",
      date: "1 day ago",
      unread: true
    },
    {
      id: "notif-3",
      title: "Account Setup Confirmed",
      description: "Your modern profile is now verified. Security elements have been successfully configured.",
      date: "1 week ago",
      unread: false
    }
  ]);

  // Security elements
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  // Account deletion states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Loading indicator helper
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = useCallback(async (userId: string) => {
    const supabase = createClient();

    // 1. Load Profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profile) {
      setProfileData({
        firstName: profile.full_name?.split(" ")[0] || "",
        lastName: profile.full_name?.split(" ").slice(1).join(" ") || "",
        email: user?.email || "",
        phone: profile.phone || "",
        birthday: profile.birthday || "",
        avatar: profile.avatar_url || "/images/testimonials/avatar-1.jpg"
      });
    }

    // 2. Load Addresses
    const { data: addrList } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId);

    if (addrList) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAddresses(addrList.map((a: any) => ({
        id: a.id,
        name: a.full_name,
        street: a.address_line1,
        city: a.city,
        country: a.country,
        phone: a.phone || "",
        isDefault: a.is_default
      })));
    }

    // 3. Load Orders
    const { data: orderList } = await supabase
      .from("orders")
      .select("*, order_items(*, products(*, product_images(*)))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (orderList) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedOrders: Order[] = orderList.map((o: any) => ({
        id: o.id,
        status: o.status,
        date: new Date(o.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        address: o.address_id || "Shipping Address",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: o.order_items.map((i: any) => ({
          id: i.id,
          name: i.products?.name || "Product Item",
          price: Number(i.price),
          quantity: i.quantity,
          image: i.products?.product_images?.[0]?.image_url || "/images/products/product-01.jpg"
        })),
        subtotal: Number(o.total) - Number(o.shipping) + Number(o.discount),
        shipping: Number(o.shipping),
        discount: Number(o.discount),
        total: Number(o.total)
      }));
      setOrders(mappedOrders);
    }

    // 4. Load Notifications
    const { data: notifList } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (notifList) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNotifications(notifList.map((n: any) => ({
        id: n.id,
        title: n.title,
        description: n.content,
        date: new Date(n.created_at).toLocaleDateString(),
        unread: !n.is_read
      })));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        loadUserData(user.id);
      }, 0);
    }
  }, [user, loadUserData]);

  // Sync session storage checkout orders if exist
  useEffect(() => {
    if (typeof window !== "undefined") {
      const orderId = sessionStorage.getItem("last_order_id");
      const orderTotal = sessionStorage.getItem("last_order_total");
      const orderAddress = sessionStorage.getItem("last_order_address");
      const orderItems = JSON.parse(sessionStorage.getItem("last_order_items") || "[]");

      interface SessionCartItem {
        id?: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
      }

      if (orderId && orderTotal) {
        const parsedItems = orderItems.map((item: SessionCartItem) => ({
          id: item.id || `item-${Math.random()}`,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }));

        const newOrder: Order = {
          id: orderId,
          status: "processing",
          date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          address: orderAddress || "Main Address",
          items: parsedItems,
          subtotal: parsedItems.reduce((acc: number, cur: SessionCartItem) => acc + cur.price * cur.quantity, 0),
          shipping: 0,
          discount: 0,
          total: Number(orderTotal)
        };

        // Add to orders state avoiding duplicates
        setTimeout(() => {
          setOrders((prev) => {
            if (prev.some((o) => o.id === orderId)) return prev;
            return [newOrder, ...prev];
          });
        }, 0);
      }
    }
  }, []);

  // Total spent calculation
  const totalSpent = useMemo(() => {
    return orders.reduce((acc, cur) => acc + cur.total, 0);
  }, [orders]);

  // Profile Save Action
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingProfile(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: `${profileData.firstName} ${profileData.lastName}`,
        phone: profileData.phone,
        birthday: profileData.birthday || null
      })
      .eq("id", user.id);

    setIsUpdatingProfile(false);
    if (error) {
      toast.error("Failed to update profile: " + error.message);
    } else {
      toast.success("Profile details updated successfully!");
      loadUserData(user.id);
    }
  };

  // Password Reset Action
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      toast.error("Please fill in all security fields.");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsChangingPassword(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPass
    });

    setIsChangingPassword(false);
    if (error) {
      toast.error("Failed to change password: " + error.message);
    } else {
      toast.success("Account password changed successfully!");
      setPasswordForm({ current: "", newPass: "", confirm: "" });
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    if (!user) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update notifications: " + error.message);
    } else {
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      toast.success("All messages marked as read.");
    }
  };

  // Address CRUD Handlers
  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({ name: "", street: "", city: "", country: "", phone: "", isDefault: false });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressForm({
      name: addr.name,
      street: addr.street,
      city: addr.city,
      country: addr.country,
      phone: addr.phone,
      isDefault: addr.isDefault
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.street || !addressForm.city || !addressForm.country || !addressForm.phone) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!user) return;
    const supabase = createClient();

    if (addressForm.isDefault) {
      // Unset all defaults
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    if (editingAddress) {
      // Update
      const { error } = await supabase
        .from("addresses")
        .update({
          full_name: addressForm.name,
          address_line1: addressForm.street,
          city: addressForm.city,
          country: addressForm.country,
          phone: addressForm.phone,
          is_default: addressForm.isDefault
        })
        .eq("id", editingAddress.id);

      if (error) {
        toast.error("Failed to update address: " + error.message);
      } else {
        toast.success("Address coordinates updated!");
      }
    } else {
      // Create
      const { error } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          full_name: addressForm.name,
          address_line1: addressForm.street,
          city: addressForm.city,
          state: addressForm.city, // fallback state to city
          postal_code: "12345",
          country: addressForm.country,
          phone: addressForm.phone,
          is_default: addressForm.isDefault
        });

      if (error) {
        toast.error("Failed to add address: " + error.message);
      } else {
        toast.success("New address coordinate registered!");
      }
    }
    setAddressModalOpen(false);
    await loadUserData(user.id);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete address: " + error.message);
    } else {
      toast.success("Address removed from account books.");
      await loadUserData(user.id);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!user) return;
    const supabase = createClient();

    // 1. Unset all defaults
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    // 2. Set this one as default
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to set default: " + error.message);
    } else {
      toast.info("Default delivery node changed.");
      await loadUserData(user.id);
    }
  };

  // Delete Account execution
  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toUpperCase() !== "DELETE") {
      toast.error("Please enter 'DELETE' to authorize account closure.");
      return;
    }
    if (!user) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to delete account data: " + error.message);
      return;
    }

    await supabase.auth.signOut();
    setDeleteModalOpen(false);
    toast.success("Account successfully scheduled for permanent deletion.");
    setTimeout(() => {
      router.push("/signup");
    }, 1500);
  };

  // Move wishlist item to cart
  const handleWishlistMoveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    toast.success(`${product.name} moved to bag!`);
  };

  // Printable invoice trigger
  const handlePrintInvoice = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed out of Homiq Trends session.");
      router.push("/login");
      router.refresh();
    }
  };

  // Navigation sidebar options
  const sidebarLinks = [
    { id: "overview", label: "Dashboard", icon: User },
    { id: "profile", label: "Profile Info", icon: Edit3 },
    { id: "orders", label: "Order History", icon: Package },
    { id: "addresses", label: "Address Book", icon: MapPin },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
    { id: "notifications", label: "System Alerts", icon: Bell },
    { id: "settings", label: "Settings & Security", icon: Settings }
  ] as const;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container>
          <div className="space-y-8">
            <SectionHeading
              title="My Account"
              subtitle="Dashboard Workspace"
              description="Manage profiles, track delivery timetables, verify invoices, and toggle preferences."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Responsive Sidebar */}
              <aside className="lg:col-span-3 bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                <div className="flex items-center gap-3.5 pb-4 border-b border-border">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary/20 shrink-0">
                    <Image 
                      src={profileData.avatar} 
                      alt={profileData.firstName} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading text-sm font-semibold text-foreground truncate">
                      {profileData.firstName} {profileData.lastName}
                    </h4>
                    <span className="text-[10px] tracking-wider uppercase font-bold text-accent">Artisan Gold Member</span>
                  </div>
                </div>

                <nav className="flex flex-col gap-1">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.id}
                        onClick={() => {
                          setActiveTab(link.id);
                          setSelectedOrder(null);
                        }}
                        className={`w-full flex items-center justify-between text-left text-xs py-3 px-4 rounded-xl transition-all cursor-pointer font-medium ${
                          activeTab === link.id
                            ? "bg-secondary text-primary font-bold shadow-2xs"
                            : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4.5 h-4.5 ${activeTab === link.id ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{link.label}</span>
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

              {/* Right Column: Dynamic Section Display */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* 1. OVERVIEW SECTION */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Welcome banner */}
                    <div className="bg-[#F8F5F2] dark:bg-[#1C1C1A] border border-border p-6 rounded-3xl flex justify-between items-center">
                      <div>
                        <h3 className="font-heading text-lg font-medium text-foreground">Welcome back, {profileData.firstName}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Check delivery updates, adjust addresses, or explore collections.</p>
                      </div>
                      <span className="text-[10px] bg-primary text-primary-foreground font-bold py-1 px-3.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                        Active Account
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Completed Orders", val: orders.length, desc: "Bespoke listings" },
                        { label: "Total Spent", val: `$${totalSpent}`, desc: "Fine curation" },
                        { label: "Saved in List", val: wishlist.length, desc: "Wishlist items" },
                        { label: "Alerts Pending", val: notifications.filter(n => n.unread).length, desc: "Unread alerts" }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-[#222220] border border-border p-5 rounded-2xl">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">{stat.label}</span>
                          <span className="text-lg font-bold text-foreground block mt-1.5 font-sans">{stat.val}</span>
                          <span className="text-[9px] text-muted-foreground font-light block mt-1">{stat.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Split view: Recent orders & default Address */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Recent Orders list */}
                      <div className="md:col-span-8 bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center border-b border-border pb-3">
                          <h4 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" /> Recent Orders
                          </h4>
                          <button onClick={() => setActiveTab("orders")} className="text-[10px] text-accent hover:underline font-semibold uppercase tracking-wider">
                            View All
                          </button>
                        </div>
                        <div className="space-y-3">
                          {orders.slice(0, 2).map((order) => (
                            <div key={order.id} className="p-4 bg-secondary/35 dark:bg-[#1C1C1A] border border-border/50 rounded-2xl flex items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-foreground">{order.id}</span>
                                  <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${
                                    order.status === "delivered" 
                                      ? "bg-emerald-100 text-emerald-700" 
                                      : "bg-amber-100 text-amber-700"
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <span className="text-[9px] text-muted-foreground block mt-1">{order.date}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold block">${order.total}</span>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setActiveTab("orders");
                                  }}
                                  className="text-[9px] text-accent hover:underline font-semibold mt-1"
                                >
                                  Invoice details &rarr;
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Default delivery node */}
                      <div className="md:col-span-4 bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl flex flex-col justify-between">
                        <div className="space-y-3.5">
                          <h4 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
                            <MapPin className="w-4 h-4 text-primary" /> Delivery Node
                          </h4>
                          {addresses.find(a => a.isDefault) ? (
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-foreground block">{addresses.find(a => a.isDefault)?.name}</span>
                              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                {addresses.find(a => a.isDefault)?.street}<br />
                                {addresses.find(a => a.isDefault)?.city}<br />
                                {addresses.find(a => a.isDefault)?.country}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground block font-light">No default address defined.</span>
                          )}
                        </div>
                        <button 
                          onClick={() => setActiveTab("addresses")} 
                          className="w-full text-center text-[10px] font-bold tracking-wider text-accent uppercase hover:underline mt-4 pt-3 border-t border-border"
                        >
                          Modify book
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PROFILE INFO TAB */}
                {activeTab === "profile" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 sm:p-8 rounded-3xl space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-4">Personal Details</h3>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">First Name</span>
                          <Input
                            type="text"
                            required
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Last Name</span>
                          <Input
                            type="text"
                            required
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Email Address</span>
                          <Input
                            type="email"
                            required
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Phone Number</span>
                          <Input
                            type="tel"
                            required
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Date of Birth</span>
                        <Input
                          type="date"
                          value={profileData.birthday}
                          onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                          className="bg-secondary/40 border-border rounded-xl text-xs py-5"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className={`${DESIGN_SYSTEM.radius.button} py-5 px-8 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest cursor-pointer shadow-xs`}
                      >
                        {isUpdatingProfile ? "Saving changes..." : "Save Changes"}
                      </Button>
                    </form>
                  </div>
                )}

                {/* 3. ORDER HISTORY & timeline details */}
                {activeTab === "orders" && (
                  <div className="space-y-6">
                    {!selectedOrder ? (
                      <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-4">
                        <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-4">My Orders</h3>
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order.id} className="p-5 bg-secondary/35 dark:bg-[#1C1C1A] border border-border/50 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-heading font-bold text-sm text-foreground">{order.id}</span>
                                  <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded font-bold ${
                                    order.status === "delivered" 
                                      ? "bg-emerald-100 text-emerald-700" 
                                      : "bg-amber-100 text-amber-700"
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground block mt-1.5">Placed: {order.date} &bull; {order.items.length} items</span>
                              </div>

                              <div className="flex items-center gap-4 sm:justify-end">
                                <div className="text-left sm:text-right">
                                  <span className="text-sm font-bold text-foreground font-sans block">${order.total}</span>
                                </div>
                                <Button
                                  onClick={() => setSelectedOrder(order)}
                                  variant="outline"
                                  className="border-border bg-white dark:bg-[#222220] text-xs font-semibold py-4 px-4 cursor-pointer"
                                >
                                  View Timeline &amp; Invoice
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Single order details with active timeline & invoice printables
                      <div className="bg-white dark:bg-[#222220] border border-border p-6 sm:p-8 rounded-3xl space-y-8 relative">
                        <div className="flex justify-between items-center border-b border-border pb-4">
                          <button
                            onClick={() => setSelectedOrder(null)}
                            className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            &larr; Back to History
                          </button>
                          <h3 className="font-heading text-base font-semibold text-foreground">{selectedOrder.id} Coordinates</h3>
                        </div>

                        {/* Visual tracking timeline */}
                        <div className="space-y-4 pt-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">Artisan Timeline</span>
                          <div className="grid grid-cols-5 text-center relative pt-4 pb-2 max-w-xl mx-auto">
                            {/* Horizontal timeline segment bar */}
                            <div className="absolute top-[26px] left-[10%] right-[10%] h-[2px] bg-border z-0">
                              <div 
                                className="h-full bg-primary transition-all duration-500" 
                                style={{
                                  width: selectedOrder.status === "delivered" ? "100%" : selectedOrder.status === "shipped" ? "75%" : selectedOrder.status === "processing" ? "50%" : "25%"
                                }}
                              />
                            </div>

                            {[
                              { label: "Placed", icon: Clock, check: true },
                              { label: "Authorized", icon: Check, check: true },
                              { label: "Dispatched", icon: Truck, check: selectedOrder.status !== "placed" },
                              { label: "Out for Courier", icon: Truck, check: selectedOrder.status === "shipped" || selectedOrder.status === "delivered" },
                              { label: "Delivered", icon: PackageCheck, check: selectedOrder.status === "delivered" }
                            ].map((milestone, idx) => {
                              const MilestoneIcon = milestone.icon;
                              return (
                                <div key={idx} className="flex flex-col items-center gap-2.5 z-10">
                                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                                    milestone.check 
                                      ? "bg-primary text-primary-foreground border-primary shadow-2xs" 
                                      : "bg-white dark:bg-[#222220] text-muted-foreground border-border"
                                  }`}>
                                    <MilestoneIcon className="w-4 h-4" />
                                  </div>
                                  <span className={`text-[9px] uppercase tracking-wider font-semibold ${milestone.check ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                                    {milestone.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Invoice billing specifications */}
                        <div className="border border-border/80 rounded-2xl p-6 bg-secondary/20 dark:bg-[#1C1C1A] space-y-6 @media print:border-none print:p-0 print:bg-transparent">
                          <div className="flex justify-between items-start border-b border-border pb-4">
                            <div>
                              <h4 className="font-heading text-base font-bold text-foreground">Homiq Trends Invoice</h4>
                              <span className="text-[10px] text-muted-foreground block mt-1">Date: {selectedOrder.date}</span>
                              <span className="text-[10px] text-muted-foreground block">Order Reference: {selectedOrder.id}</span>
                            </div>
                            <Button
                              onClick={handlePrintInvoice}
                              className="bg-primary text-primary-foreground hover:bg-primary/95 text-[10px] uppercase font-bold tracking-wider py-4 px-4 flex items-center gap-1.5 cursor-pointer shadow-xs print:hidden"
                            >
                              <Download className="w-3.5 h-3.5" /> Download Invoice
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Invoice Line Items</span>
                            <div className="space-y-3.5">
                              {selectedOrder.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                  <div className="flex gap-2.5 items-center">
                                    <div className="w-8 h-10 relative bg-secondary rounded-lg overflow-hidden border border-border">
                                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                      <span className="font-medium text-foreground block">{item.name}</span>
                                      <span className="text-[10px] text-muted-foreground">Qty: {item.quantity} &bull; ${item.price} each</span>
                                    </div>
                                  </div>
                                  <span className="font-bold text-foreground">${item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border pt-4 space-y-2 text-xs">
                            <div className="flex justify-between text-muted-foreground">
                              <span>Subtotal</span>
                              <span className="font-sans font-semibold">${selectedOrder.subtotal}</span>
                            </div>
                            {selectedOrder.discount > 0 && (
                              <div className="flex justify-between text-emerald-600">
                                <span>Savings Discount</span>
                                <span className="font-sans font-semibold">-${selectedOrder.discount}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-muted-foreground">
                              <span>Courier Delivery Speed</span>
                              <span className="font-sans font-semibold">
                                {selectedOrder.shipping === 0 ? "Free" : `$${selectedOrder.shipping}`}
                              </span>
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between items-baseline text-sm">
                              <span className="font-bold text-foreground">Total Paid</span>
                              <span className="text-base font-extrabold text-foreground">${selectedOrder.total}</span>
                            </div>
                          </div>

                          <div className="border-t border-border/60 pt-4 text-[10px] text-muted-foreground/80 leading-relaxed font-light">
                            <strong>Delivery Destination Node:</strong> {selectedOrder.address}<br />
                            Thank you for partnering with Homiq Trends design curation houses. Transactions are fully secured.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. ADDRESS BOOK TAB */}
                {activeTab === "addresses" && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                      <div className="flex justify-between items-center border-b border-border pb-4">
                        <h3 className="font-heading text-lg font-semibold text-foreground">Address Book</h3>
                        <Button
                          onClick={handleOpenAddAddress}
                          className="bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-wider py-4 px-4 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> Add Address
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`border p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all ${
                              addr.isDefault 
                                ? "border-primary bg-primary/5 dark:bg-primary/10" 
                                : "border-border bg-white dark:bg-[#222220]"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-heading font-semibold text-xs text-foreground uppercase tracking-wider">
                                  {addr.name}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[9px] uppercase tracking-wider bg-primary/20 text-primary font-bold px-2 py-0.5 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                                {addr.street}<br />
                                {addr.city}<br />
                                {addr.country}
                              </p>
                              <span className="text-[10px] text-muted-foreground block font-mono">Tel: {addr.phone}</span>
                            </div>

                            <div className="flex gap-2 items-center border-t border-border/60 pt-3 text-[11px] font-semibold text-accent justify-between">
                              <div className="flex gap-3">
                                <button onClick={() => handleOpenEditAddress(addr)} className="hover:underline cursor-pointer flex items-center gap-0.5">
                                  <Edit3 className="w-3.5 h-3.5" /> Edit
                                </button>
                                {!addr.isDefault && (
                                  <button onClick={() => handleDeleteAddress(addr.id)} className="text-destructive hover:underline cursor-pointer flex items-center gap-0.5">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                  </button>
                                )}
                              </div>
                              {!addr.isDefault && (
                                <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-primary hover:underline cursor-pointer">
                                  Set Default
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address edit/create Modal */}
                    {addressModalOpen && (
                      <>
                        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setAddressModalOpen(false)} />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#222220] rounded-3xl border border-border z-50 p-6 shadow-2xl space-y-4">
                          <h4 className="font-heading text-base font-semibold text-foreground border-b border-border pb-3">
                            {editingAddress ? "Edit Address coordinate" : "Register new address node"}
                          </h4>
                          <form onSubmit={handleSaveAddress} className="space-y-4">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Label Name</span>
                              <Input
                                type="text"
                                required
                                placeholder="e.g. Main Residence"
                                value={addressForm.name}
                                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Street Address</span>
                              <Input
                                type="text"
                                required
                                placeholder="123 Milan High St"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">City &amp; Postal Code</span>
                              <Input
                                type="text"
                                required
                                placeholder="Milan, 20121"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Country</span>
                              <Input
                                type="text"
                                required
                                placeholder="Italy"
                                value={addressForm.country}
                                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Phone Coordinate</span>
                              <Input
                                type="tel"
                                required
                                placeholder="+39 02 1234 5678"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                              />
                            </div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={addressForm.isDefault}
                                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                className="accent-primary"
                              />
                              <span>Set as default address</span>
                            </label>

                            <div className="flex gap-2 pt-2">
                              <Button
                                type="submit"
                                className="flex-1 py-4 bg-primary text-primary-foreground text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                              >
                                Save Node
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setAddressModalOpen(false)}
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

                {/* 5. WISHLIST TAB MAPPED */}
                {activeTab === "wishlist" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-4">My Wishlist</h3>
                    
                    {wishlist.length === 0 ? (
                      <div className="text-center py-12 space-y-4">
                        <Heart className="w-12 h-12 text-muted-foreground/60 mx-auto stroke-[1.25]" />
                        <h4 className="font-heading text-base font-semibold text-foreground">Wishlist is empty</h4>
                        <p className="text-xs text-muted-foreground font-light max-w-xs mx-auto">Saved articles will appear here for checkout additions.</p>
                        <Link href="/products">
                          <Button className="bg-primary text-primary-foreground py-4 px-6 text-xs uppercase tracking-wider font-bold rounded-xl mt-2 cursor-pointer">
                            Browse Collection
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {wishlist.map((product) => (
                          <div key={product.id} className="border border-border p-4 rounded-2xl flex gap-3.5 items-center justify-between bg-[#F8F5F2] dark:bg-[#1C1C1A]">
                            <div className="flex gap-3 items-center min-w-0">
                              <div className="relative w-12 h-14 bg-white dark:bg-[#222220] rounded-xl overflow-hidden border border-border shrink-0">
                                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-sans font-semibold text-xs text-foreground truncate">{product.name}</h4>
                                <span className="text-xs text-accent font-bold mt-0.5 block">${product.salePrice ?? product.price}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                onClick={() => handleWishlistMoveToCart(product)}
                                className="bg-primary text-primary-foreground hover:bg-primary/95 text-[10px] uppercase font-bold tracking-wider py-3.5 px-3 rounded-lg cursor-pointer"
                              >
                                Bag
                              </Button>
                              <button
                                onClick={() => {
                                  removeFromWishlist(product.id);
                                  toast.info("Removed from saved list.");
                                }}
                                className="text-muted-foreground hover:text-destructive p-1.5 border border-border bg-white dark:bg-[#222220] rounded-lg cursor-pointer"
                                title="Remove saved item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground">Inbox Notifications</h3>
                      {notifications.some(n => n.unread) && (
                        <button onClick={handleMarkAllRead} className="text-[10px] text-accent hover:underline font-bold uppercase tracking-wider">
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 rounded-2xl border flex gap-3.5 items-start transition-all ${
                            notif.unread 
                              ? "border-primary bg-primary/5 dark:bg-primary/10" 
                              : "border-border bg-secondary/20 dark:bg-[#1C1C1A]"
                          }`}
                        >
                          <Bell className={`w-5 h-5 shrink-0 mt-0.5 ${notif.unread ? "text-primary fill-primary/10" : "text-muted-foreground"}`} />
                          <div className="space-y-1.5 flex-1">
                            <div className="flex justify-between items-baseline gap-2">
                              <h4 className={`text-xs ${notif.unread ? "font-bold text-foreground" : "font-semibold text-foreground/80"}`}>
                                {notif.title}
                              </h4>
                              <span className="text-[9px] text-muted-foreground shrink-0">{notif.date}</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-light leading-relaxed">
                              {notif.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. SETTINGS & SECURITY TAB */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white dark:bg-[#222220] border border-border p-6 sm:p-8 rounded-3xl space-y-6">
                      <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-4">Configure Preferences</h3>
                      
                      {/* Theme toggle */}
                      <div className="flex items-center justify-between text-xs border-b border-border/60 pb-4">
                        <div>
                          <span className="font-semibold text-foreground block">Workspace Appearance</span>
                          <span className="text-[10px] text-muted-foreground font-light mt-0.5">Toggle light neutrals and night modes.</span>
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

                      {/* Language selection */}
                      <div className="flex items-center justify-between text-xs border-b border-border/60 pb-4">
                        <div>
                          <span className="font-semibold text-foreground block">System Language</span>
                          <span className="text-[10px] text-muted-foreground font-light mt-0.5">Choose layout translation catalogs.</span>
                        </div>
                        <div className="flex items-center gap-1.5 border border-border rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#222220]">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <select className="text-xs font-bold text-foreground bg-transparent border-none focus:outline-none cursor-pointer">
                            <option>English (UK)</option>
                            <option>Italiano</option>
                            <option>日本語</option>
                          </select>
                        </div>
                      </div>

                      {/* Notifications updates */}
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Email &amp; SMS alerts</span>
                        <div className="flex flex-col gap-2.5 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" defaultChecked className="accent-primary" />
                            <span>Subscribe to monthly artisan catalog newsletters</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" defaultChecked className="accent-primary" />
                            <span>Receive order status SMS coordinates</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white dark:bg-[#222220] border border-border p-6 sm:p-8 rounded-3xl space-y-6">
                      <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" /> Security &amp; Access
                      </h3>
                      <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Current Password</span>
                          <Input
                            type="password"
                            required
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">New Password</span>
                            <Input
                              type="password"
                              required
                              value={passwordForm.newPass}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                              className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Confirm Password</span>
                            <Input
                              type="password"
                              required
                              value={passwordForm.confirm}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                              className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isChangingPassword}
                          className={`${DESIGN_SYSTEM.radius.button} py-5 px-8 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold uppercase tracking-widest cursor-pointer shadow-xs`}
                        >
                          {isChangingPassword ? "Saving password..." : "Change Password"}
                        </Button>
                      </form>
                    </div>

                    {/* Dangerous account deletion */}
                    <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-6 sm:p-8 rounded-3xl space-y-4">
                      <h3 className="font-heading text-lg font-semibold text-destructive flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-destructive" /> Danger Zone
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Permanently close your Homiq Trends digital account. This wipes order logs, payment credentials, and is entirely irreversible.
                      </p>
                      <Button
                        onClick={() => {
                          setDeleteConfirmText("");
                          setDeleteModalOpen(true);
                        }}
                        className="bg-destructive text-white hover:bg-destructive/95 text-xs font-bold uppercase tracking-wider py-5 px-6 rounded-xl cursor-pointer"
                      >
                        Delete My Account
                      </Button>
                    </div>

                    {/* Account deletion warning modal */}
                    {deleteModalOpen && (
                      <>
                        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setDeleteModalOpen(false)} />
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#222220] rounded-3xl border border-border z-50 p-6 shadow-2xl space-y-4">
                          <h4 className="font-heading text-base font-semibold text-destructive flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-destructive" /> Permanent Account Closure
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            This action is immediate and non-reversible. To authorize deletion, please type <span className="font-bold text-destructive uppercase">DELETE</span> below.
                          </p>
                          <Input
                            type="text"
                            placeholder="Type DELETE"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="bg-secondary/40 border-border text-xs py-4.5 rounded-xl uppercase font-mono"
                          />
                          <div className="flex gap-2 pt-2">
                            <Button
                              onClick={handleDeleteAccount}
                              className="flex-1 py-4 bg-destructive text-white text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                            >
                              Confirm Deletion
                            </Button>
                            <Button
                              onClick={() => setDeleteModalOpen(false)}
                              variant="outline"
                              className="flex-1 py-4 border-border text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
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
