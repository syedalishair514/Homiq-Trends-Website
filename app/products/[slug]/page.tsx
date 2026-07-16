"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/shared/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS } from "@/constants/products";
import { Product } from "@/types/product";
import { createClient } from "@/lib/supabase/client";
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Info,
  Layers,
  ChevronRight,
  ShieldCheck,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailsProps {
  params: Promise<{ slug: string }>;
}

function ProductDetailsContent({ params }: ProductDetailsProps) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setIsLoadingProduct(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(*)")
          .eq("slug", slug)
          .single();

        if (!error && data) {
          const mapped: Product = {
            id: data.id,
            sku: data.sku,
            name: data.name,
            slug: data.slug,
            shortDescription: data.short_description,
            description: data.description,
            price: Number(data.price),
            salePrice: data.sale_price ? Number(data.sale_price) : undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            images: data.product_images?.sort((a: any, b: any) => a.priority - b.priority).map((img: any) => img.image_url) || [],
            category: data.category || "Decoration",
            rating: data.rating ? Number(data.rating) : 5,
            reviewsCount: data.reviews_count || 0,
            stock: data.stock,
            isFeatured: data.rating >= 4.7,
            bestSeller: data.reviews_count > 30,
            newArrival: false,
            createdAt: data.created_at
          };
          setProduct(mapped);
        } else {
          setProduct(PRODUCTS.find((p) => p.slug === slug) || null);
        }
      } catch {
        setProduct(PRODUCTS.find((p) => p.slug === slug) || null);
      } finally {
        setIsLoadingProduct(false);
      }
    }
    loadProduct();
  }, [slug]);

  // Gallery States
  const [selectedImage, setSelectedImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isZoomed, setIsZoomed] = useState(false);

  // Selector States
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Neutral Beige");
  const [selectedSize, setSelectedSize] = useState("Standard");

  // Tab & Modal States
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "faqs" | "reviews">("description");
  const [compareOpen, setCompareOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!product) return;
    const prodId = product.id;
    async function loadReviews() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("reviews")
          .select("*, profiles(full_name)")
          .eq("product_id", prodId)
          .eq("status", "approved");

        if (!error && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setReviews(data.map((r: any) => ({
            author: r.profiles?.full_name || "Anonymous",
            date: new Date(r.created_at).toLocaleDateString(),
            rating: r.rating,
            content: r.comment
          })));
        } else {
          setReviews([
            { author: "Eleanor Vance", date: "June 12, 2026", rating: 5, content: "Sublime addition to my lounge setup. Heavy, solid, and holds a gorgeous pattern. Shipping was fast." },
            { author: "Marcus Aurelius", date: "April 28, 2026", rating: 5, content: "Masterfully crafted wood details. The pre-washed textiles are warm and incredibly premium." }
          ]);
        }
      } catch {
        // fallback
      }
    }
    loadReviews();
  }, [product]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to submit a review.");
      return;
    }

    setIsSubmittingReview(true);
    const { error } = await supabase
      .from("reviews")
      .insert({
        product_id: product.id,
        user_id: user.id,
        rating: newRating,
        comment: newComment,
        status: "approved"
      });

    setIsSubmittingReview(false);
    if (error) {
      toast.error("Failed to post review: " + error.message);
    } else {
      toast.success("Review posted successfully!");
      setNewComment("");
      // reload reviews
      const { data } = await supabase
        .from("reviews")
        .select("*, profiles(full_name)")
        .eq("product_id", product.id)
        .eq("status", "approved");
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setReviews(data.map((r: any) => ({
          author: r.profiles?.full_name || "Anonymous",
          date: new Date(r.created_at).toLocaleDateString(),
          rating: r.rating,
          content: r.comment
        })));
      }
    }
  };

  const buyButtonRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  // Reset selected image on slug changes
  useEffect(() => {
    if (product) {
      setTimeout(() => {
        setSelectedImage(product.images[0]);
        setQuantity(1);
      }, 0);
    }
  }, [product]);

  // Handle Recently Viewed tracker
  useEffect(() => {
    if (product) {
      const saved = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
      const filtered = saved.filter((id: string) => id !== product.id);
      const updated = [product.id, ...filtered].slice(0, 4);
      localStorage.setItem("recently_viewed", JSON.stringify(updated));
    }
  }, [product]);

  // Load recently viewed lists
  useEffect(() => {
    if (product) {
      const saved = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
      const filteredSaved = saved.filter((id: string) => id !== product.id);
      const matched = filteredSaved
        .map((id: string) => PRODUCTS.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      setTimeout(() => {
        setRecentlyViewed(matched);
      }, 0);
    }
  }, [product]);

  // Scroll detection for sticky buy bar
  useEffect(() => {
    const handleScroll = () => {
      if (buyButtonRef.current) {
        const rect = buyButtonRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] flex items-center justify-center text-center">
          <Container>
            <div className="space-y-4">
              <h2 className="font-heading text-3xl font-semibold">Product Not Found</h2>
              <p className="text-sm text-muted-foreground">The requested product could not be located in our catalog.</p>
              <Link href="/products" className="text-xs uppercase tracking-widest font-semibold text-primary block hover:underline">
                &larr; Back to Catalog
              </Link>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;

  const handleLikeToggle = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist.");
    } else {
      addToWishlist(product);
      toast.success("Saved to wishlist!");
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const handleShareProduct = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Hover zoom triggers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.5)"
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({ transformOrigin: "center", transform: "scale(1)" });
  };

  // Specs mocks
  const specs = {
    materials: product.category === "Lighting" ? "Spun Brass, Hand-polished copper" : product.category === "Decoration" ? " Roman Honed Travertine Stone" : "Organic pre-washed flax fibers",
    dimensions: product.category === "Furniture" ? "32\" W x 30\" D x 28\" H" : "12\" x 10\" x 4.5\"",
    origin: "Handcrafted in Milan, Italy",
    weight: product?.category === "Decoration" ? "14 lbs (Heavy solid slab)" : "4.5 lbs"
  };

  if (isLoadingProduct || !product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-muted-foreground font-light">Loading premium design details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const recommended = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div key={slug} className="relative">
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816] space-y-16">
        <Container>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/80 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-semibold truncate max-w-[150px]">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Image Zoom Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div 
                className="aspect-[4/5] relative bg-white dark:bg-[#222220] rounded-3xl overflow-hidden border border-border cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover transition-transform duration-200"
                    style={isZoomed ? zoomStyle : undefined}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none justify-center lg:justify-start">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all duration-200 ${
                        selectedImage === img ? "border-primary scale-102" : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Checkout Info details block */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block mb-2">
                      {product.category}
                    </span>
                    <h1 className="font-heading text-3xl font-medium tracking-wide text-foreground leading-tight">
                      {product.name}
                    </h1>
                    <span className="text-xs text-muted-foreground font-mono mt-1.5 block">SKU: {product.sku}</span>
                  </div>
                  
                  {/* Share button */}
                  <button
                    onClick={handleShareProduct}
                    className="p-3 bg-white dark:bg-[#222220] border border-border rounded-full hover:bg-secondary cursor-pointer shadow-2xs hover:scale-105 transition-all duration-200 text-muted-foreground hover:text-foreground"
                    title="Share item"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-accent">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-accent/20"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground font-light">({product.reviewsCount} reviews)</span>
                </div>

                {/* Price block */}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl font-bold text-foreground font-sans">
                    ${product.salePrice ?? product.price}
                  </span>
                  {product.salePrice && (
                    <span className="text-lg text-muted-foreground line-through font-light">
                      ${product.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Attributes Selectors */}
              <div className="space-y-4 pt-4 border-t border-border">
                {/* Color swatches */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Select Color: {selectedColor}</span>
                  <div className="flex gap-2">
                    {["Neutral Beige", "Matte Black", "Oatmeal Specks"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer transition-all ${
                          selectedColor === c 
                            ? "border-primary bg-primary/10 text-primary font-bold" 
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size options */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Select Size: {selectedSize}</span>
                  <div className="flex gap-2">
                    {["Standard", "Grand Edition", "Miniature"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer transition-all ${
                          selectedSize === s 
                            ? "border-primary bg-primary/10 text-primary font-bold" 
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity & Buy Buttons */}
              <div ref={buyButtonRef} className="space-y-4 pt-4 border-t border-border">
                <div className="flex gap-4">
                  {/* Quantity adjustment */}
                  <div className="flex items-center border border-border rounded-xl h-12 bg-white dark:bg-[#222220] shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 text-center font-bold hover:text-primary transition-colors cursor-pointer text-sm"
                      disabled={isOutOfStock}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="w-10 text-center font-bold hover:text-primary transition-colors cursor-pointer text-sm"
                      disabled={isOutOfStock}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <Button
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`${DESIGN_SYSTEM.radius.button} flex-1 py-6 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xs`}
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </Button>
                </div>

                <div className="flex gap-3">
                  {/* Wishlist toggle */}
                  <Button
                    onClick={handleLikeToggle}
                    variant="outline"
                    className="w-1/2 border-border bg-white dark:bg-[#222220] py-5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-destructive text-destructive" : ""}`} /> 
                    {isLiked ? "Saved" : "Save to List"}
                  </Button>

                  {/* Specs Comparison */}
                  <Button
                    onClick={() => setCompareOpen(true)}
                    variant="outline"
                    className="w-1/2 border-border bg-white dark:bg-[#222220] py-5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" /> Compare Specs
                  </Button>
                </div>
              </div>

              {/* Availability Banners */}
              <div className="space-y-3 pt-4 border-t border-border text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4.5 h-4.5 text-accent stroke-[1.5]" />
                  <span className="text-muted-foreground">
                    Free courier shipping on order subtotals. Standard delivery 3–5 business days.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-accent stroke-[1.5]" />
                  <span className="text-muted-foreground">
                    Artisan warranty coverage of 2 years on structural stone and wood logs.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Tabs section */}
          <div className="pt-16 border-t border-border/60">
            <div className="flex gap-6 border-b border-border overflow-x-auto pb-3">
              {([
                { id: "description", label: "Description" },
                { id: "specifications", label: "Specifications" },
                { id: "faqs", label: "FAQs" },
                { id: "reviews", label: "Reviews" }
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-8 font-light text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {activeTab === "description" && (
                <div className="space-y-4">
                  <p>{product.description}</p>
                  <p>
                    Each item is crafted from selected pieces of raw elements, preserving natural fissures, grain patterns, and speckles. No two pieces are exactly identical, making your acquisition unique.
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    <tr className="border-b border-border py-2.5 flex justify-between">
                      <td className="font-semibold text-foreground uppercase tracking-wider py-2">Material Structure</td>
                      <td className="py-2">{specs.materials}</td>
                    </tr>
                    <tr className="border-b border-border py-2.5 flex justify-between">
                      <td className="font-semibold text-foreground uppercase tracking-wider py-2">Dimensions</td>
                      <td className="py-2">{specs.dimensions}</td>
                    </tr>
                    <tr className="border-b border-border py-2.5 flex justify-between">
                      <td className="font-semibold text-foreground uppercase tracking-wider py-2">Arstisan Weight</td>
                      <td className="py-2">{specs.weight}</td>
                    </tr>
                    <tr className="border-b border-border py-2.5 flex justify-between">
                      <td className="font-semibold text-foreground uppercase tracking-wider py-2">Country of Origin</td>
                      <td className="py-2">{specs.origin}</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {activeTab === "faqs" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-sans font-bold text-foreground text-xs uppercase tracking-wider mb-2">How should I clean this piece?</h4>
                    <p>We recommend dry wiping with a soft microfiber cloth. Avoid commercial household cleaners containing ammonia or citrus acids.</p>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-foreground text-xs uppercase tracking-wider mb-2">Can I adjust dimensions?</h4>
                    <p>Yes, we support bespoke sizing on select travertine tables and walnut benches. Please reach out to trade@homiqtrends.com.</p>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {reviews.map((r, i) => (
                    <div key={i} className="space-y-2 border-b border-border/40 pb-4 last:border-b-0 text-left">
                      <div className="flex justify-between items-baseline">
                        <h5 className="font-sans font-semibold text-foreground text-xs">{r.author}</h5>
                        <span className="text-[10px] text-muted-foreground">{r.date}</span>
                      </div>
                      <div className="flex text-accent">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`w-3 h-3 ${idx < r.rating ? "fill-accent text-accent" : "text-accent/20"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground font-light leading-relaxed">{r.content}</p>
                    </div>
                  ))}

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="space-y-4 pt-6 border-t border-border/50 text-left">
                    <h4 className="font-heading text-sm font-semibold text-foreground">Write a Review</h4>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Rating Score</span>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="bg-secondary/40 border border-border rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-accent w-full max-w-[150px]"
                      >
                        {[5, 4, 3, 2, 1].map(score => (
                          <option key={score} value={score}>{score} Stars</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Comment</span>
                      <textarea
                        required
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts about this premium design..."
                        rows={3}
                        className="bg-secondary/40 border border-border rounded-xl text-xs p-3 focus:outline-none focus:border-accent w-full font-light"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-primary text-primary-foreground py-3 px-6 text-xs uppercase tracking-widest font-bold rounded-xl cursor-pointer"
                    >
                      {isSubmittingReview ? "Submitting..." : "Post Review"}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* Recommended Products grid */}
        {recommended.length > 0 && (
          <Container>
            <div className="space-y-8 border-t border-border pt-12">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold font-sans">Artisan Pairings</span>
                <h3 className="font-heading text-2xl font-semibold text-foreground mt-1">Complete the Look</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommended.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          </Container>
        )}

        {/* Recently Viewed products */}
        {recentlyViewed.length > 0 && (
          <Container>
            <div className="space-y-8 border-t border-border pt-12">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold font-sans">Saved History</span>
                <h3 className="font-heading text-2xl font-semibold text-foreground mt-1">Recently Viewed</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recentlyViewed.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          </Container>
        )}
      </main>

      {/* Sticky Buy Bar (Desktop / Mobile scroll panel) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#181816]/95 backdrop-blur-md border-t border-border py-4 px-6 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-14 bg-[#F8F5F2] dark:bg-[#1C1C1A] rounded-lg overflow-hidden border border-border">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-sans font-semibold text-xs text-foreground truncate max-w-[150px] sm:max-w-xs">{product.name}</h4>
                <span className="text-xs text-accent font-bold">${product.salePrice ?? product.price}</span>
              </div>
            </div>
            <Button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground py-4 px-6 text-xs uppercase tracking-widest font-bold rounded-xl cursor-pointer shadow-sm hover:bg-primary/95"
            >
              Add to Bag
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Specification Comparison Modal */}
      <AnimatePresence>
        {compareOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCompareOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white dark:bg-[#222220] rounded-3xl border border-border z-50 p-6 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center border-b border-border pb-4">
                <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Comparative Highlights
                </h3>
                <button onClick={() => setCompareOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer text-xs uppercase font-bold">
                  Close
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-light text-muted-foreground">
                  <div className="space-y-2">
                    <span className="font-semibold text-foreground uppercase tracking-wider block text-[10px]">Active Product</span>
                    <div className="font-sans font-bold text-foreground text-sm line-clamp-1">{product.name}</div>
                    <div>Price: <strong className="text-foreground">${product.salePrice ?? product.price}</strong></div>
                    <div>Rating: <strong className="text-foreground">{product.rating} ★</strong></div>
                    <div>Origin: <strong className="text-foreground">{specs.origin}</strong></div>
                    <div>Materials: <strong className="text-foreground">{specs.materials}</strong></div>
                  </div>
                  
                  <div className="space-y-2 border-l border-border pl-4">
                    <span className="font-semibold text-foreground uppercase tracking-wider block text-[10px]">Average Catalog Piece</span>
                    <div className="font-sans font-bold text-foreground text-sm line-clamp-1">Homiq Standard Design</div>
                    <div>Price: <strong className="text-foreground">$165 Average</strong></div>
                    <div>Rating: <strong className="text-foreground">4.6 ★ Average</strong></div>
                    <div>Origin: <strong className="text-foreground">Artisan kiln sites</strong></div>
                    <div>Materials: <strong className="text-foreground">Solid natural components</strong></div>
                  </div>
                </div>

                <div className="bg-secondary/40 p-4 rounded-xl flex gap-2 items-start text-xs font-light text-muted-foreground">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Our signature line uses Roman Travertine block selections and Black American Walnut cores, providing 30% higher material density than composite alternatives.
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setCompareOpen(false)}
                className="w-full py-4 bg-primary text-primary-foreground text-xs uppercase font-bold tracking-wider rounded-xl cursor-pointer"
              >
                Close Comparison
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function ProductDetailsPage({ params }: ProductDetailsProps) {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen pt-32 pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <ProductDetailsContent params={params} />
    </React.Suspense>
  );
}
