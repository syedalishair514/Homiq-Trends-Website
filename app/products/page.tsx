"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/constants/products";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ProductCard from "@/components/shared/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUp } from "@/constants/animations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Star, 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  ShoppingBag,
  Heart,
  X
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DESIGN_SYSTEM } from "@/constants/theme";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const CATEGORY_TABS = ["All", "Lighting", "Bedroom", "Kitchen", "Decoration", "Furniture"];
const COLORS_FILTER = [
  { name: "Beige", hex: "#D9B79A" },
  { name: "Black", hex: "#1F1F1F" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gold", hex: "#C69A63" },
  { name: "Grey", hex: "#9E988F" }
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*, product_images(*)");

        if (!error && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: Product[] = data.map((p: any) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            slug: p.slug,
            shortDescription: p.short_description,
            description: p.description,
            price: Number(p.price),
            salePrice: p.sale_price ? Number(p.sale_price) : undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          setProductsList(mapped);
        } else {
          setProductsList(PRODUCTS);
        }
      } catch {
        setProductsList(PRODUCTS);
      }
    }
    loadProducts();
  }, []);

  const sourceProducts = productsList.length > 0 ? productsList : PRODUCTS;

  // Route URL Params
  const categoryParam = searchParams.get("category") || "All";
  const initialFilter = searchParams.get("filter") || "";

  // State Variables
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("featured");
  
  // Advanced Filter States
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [availability, setAvailability] = useState<string>("all"); // 'all', 'in-stock', 'on-sale'
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // UI states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Active Category resolver
  const activeCategory = CATEGORY_TABS.find(
    (t) => t.toLowerCase() === categoryParam.toLowerCase()
  ) || "All";

  // Category change wrapper
  const handleCategoryChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "All") {
      params.delete("category");
    } else {
      params.set("category", tab.toLowerCase());
    }
    router.push(`/products?${params.toString()}`);
    setCurrentPage(1);
  };

  // Clear all filters action
  const handleResetFilters = () => {
    setSearchQuery("");
    setPriceRange(1000);
    setMinRating(null);
    setAvailability("all");
    setSelectedColor(null);
    setSortBy("featured");
    setCurrentPage(1);
    router.push("/products");
  };

  // Color tag matching utility
  const matchesColorTags = (product: Product, color: string) => {
    const text = (product.name + " " + product.description + " " + product.category).toLowerCase();
    if (color === "Beige") {
      return text.includes("brass") || text.includes("travertine") || text.includes("linen") || text.includes("blanket") || text.includes("boucle") || text.includes("cord") || text.includes("speckled") || text.includes("oatmeal") || text.includes("beige");
    }
    if (color === "Black") {
      return text.includes("black") || text.includes("noir") || text.includes("coal") || text.includes("dark");
    }
    if (color === "White") {
      return text.includes("white") || text.includes("alabaster") || text.includes("cream");
    }
    if (color === "Gold") {
      return text.includes("gold") || text.includes("brass") || text.includes("amber");
    }
    if (color === "Grey") {
      return text.includes("grey") || text.includes("slate") || text.includes("charcoal");
    }
    return true;
  };

  // Complex Filter Logic
  const filteredProducts = useMemo(() => {
    return sourceProducts.filter((product) => {
      // 1. Category Filter
      const matchesCategory =
        activeCategory === "All" ||
        product.category.toLowerCase() === activeCategory.toLowerCase();

      // 2. Query Filters (new, best, sale)
      let matchesFilter = true;
      if (initialFilter === "new") {
        matchesFilter = product.newArrival === true;
      } else if (initialFilter === "best") {
        matchesFilter = product.bestSeller === true;
      } else if (initialFilter === "sale") {
        matchesFilter = !!product.salePrice;
      }

      // 3. Search Query Filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      // 4. Price Filter
      const activePrice = product.salePrice ?? product.price;
      const matchesPrice = activePrice <= priceRange;

      // 5. Rating Filter
      const matchesRating = minRating === null || product.rating >= minRating;

      // 6. Availability Filter
      let matchesAvailability = true;
      if (availability === "in-stock") {
        matchesAvailability = product.stock > 0;
      } else if (availability === "on-sale") {
        matchesAvailability = !!product.salePrice;
      }

      // 7. Color Filter
      const matchesColor = selectedColor === null || matchesColorTags(product, selectedColor);

      return matchesCategory && matchesFilter && matchesSearch && matchesPrice && matchesRating && matchesAvailability && matchesColor;
    });
  }, [activeCategory, initialFilter, searchQuery, priceRange, minRating, availability, selectedColor, sourceProducts]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-low") {
      return list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    }
    if (sortBy === "price-high") {
      return list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    }
    if (sortBy === "rating") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === "newest") {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list; // Featured / Default
  }, [filteredProducts, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist.`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} saved to wishlist!`);
    }
  };

  const renderFilterSidebar = () => (
    <div className="space-y-8">
      {/* Search Inside Catalog */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Search Search</h4>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search within page..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-secondary/40 border-border rounded-xl text-xs py-5"
          />
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Price Range</h4>
          <span className="text-xs font-bold text-accent">${priceRange} Max</span>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onChange={(e) => {
            setPriceRange(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>$0</span>
          <span>$1,000</span>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Availability</h4>
        <div className="space-y-2">
          {["all", "in-stock", "on-sale"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-xs text-foreground/80 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={availability === opt}
                onChange={() => {
                  setAvailability(opt);
                  setCurrentPage(1);
                }}
                className="accent-primary"
              />
              <span className="capitalize">{opt.replace("-", " ")}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Min Rating</h4>
        <div className="space-y-2">
          {[
            { label: "Show All", value: null },
            { label: "4.8 Stars & Up", value: 4.8 },
            { label: "4.5 Stars & Up", value: 4.5 }
          ].map((item) => (
            <label key={item.label} className="flex items-center gap-2 text-xs text-foreground/80 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === item.value}
                onChange={() => {
                  setMinRating(item.value);
                  setCurrentPage(1);
                }}
                className="accent-primary"
              />
              <span className="flex items-center gap-1">
                {item.label} {item.value && <Star className="w-3 h-3 fill-accent text-accent" />}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors Swatches */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Color Palette</h4>
        <div className="flex flex-wrap gap-2.5">
          {COLORS_FILTER.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                setSelectedColor(selectedColor === c.name ? null : c.name);
                setCurrentPage(1);
              }}
              title={c.name}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110",
                selectedColor === c.name 
                  ? "border-accent ring-2 ring-accent/20" 
                  : "border-border"
              )}
              style={{ backgroundColor: c.hex }}
            >
              {selectedColor === c.name && (
                <Check className={cn("w-3.5 h-3.5", c.name === "White" ? "text-black" : "text-white")} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <Button
        onClick={handleResetFilters}
        variant="ghost"
        className="w-full py-4 text-xs font-bold uppercase tracking-wider text-accent hover:text-accent/80 hover:bg-secondary cursor-pointer"
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[calc(var(--navbar-height)+1.5rem)] pb-16 bg-[#FAFAF8] dark:bg-[#181816]">
        <Container>
          <div className="space-y-8">
            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/80">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-semibold">Catalog</span>
              {activeCategory !== "All" && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-primary font-semibold">{activeCategory}</span>
                </>
              )}
            </div>

            <SectionHeading
              title="Design Curation Catalog"
              subtitle="Bespoke Collections"
              description="Explore hand-finished furniture, spun brass lights, Roman travertine trays, and premium wool textiles."
            />

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto w-full pb-2 border-b border-border/60 scrollbar-none">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleCategoryChange(tab)}
                  className={`text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                    activeCategory === tab
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Catalog Layout Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Filter Sidebar (Desktop) */}
              <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-[#222220] border border-border p-6 rounded-3xl space-y-6">
                {renderFilterSidebar()}
              </aside>

              {/* Right Column: Catalog Grid/List */}
              <div className="lg:col-span-9 space-y-6">
                {/* Control Panel: Counter, Sorting, View Modes */}
                <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#222220] border border-border p-4 rounded-2xl">
                  {/* Left Side: Counter & Mobile Filter Trigger */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setMobileFiltersOpen(true)}
                      variant="outline"
                      className="lg:hidden border-border bg-transparent text-xs py-4 px-3 flex items-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-4.5 h-4.5" /> Filters
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Showing {sortedProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
                      {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} items
                    </span>
                  </div>

                  {/* Right Side: Sorting & View Mode Switches */}
                  <div className="flex items-center gap-3">
                    {/* Sorting dropdown */}
                    <div className="flex items-center gap-1">
                      <span className="hidden sm:inline text-[11px] text-muted-foreground uppercase tracking-wider">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="bg-[#F8F5F2] dark:bg-[#1C1C1A] border border-border rounded-xl px-2 py-1.5 text-xs text-foreground cursor-pointer outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating Reviews</option>
                        <option value="newest">New Arrivals</option>
                      </select>
                    </div>

                    {/* Grid/List layout toggle */}
                    <div className="flex items-center border border-border rounded-xl p-0.5 bg-secondary/50">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors cursor-pointer",
                          viewMode === "grid" 
                            ? "bg-white dark:bg-[#222220] text-primary shadow-2xs" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        aria-label="Grid View"
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                          "p-1.5 rounded-lg transition-colors cursor-pointer",
                          viewMode === "list" 
                            ? "bg-white dark:bg-[#222220] text-primary shadow-2xs" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        aria-label="List View"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Catalog Listing */}
                <AnimatePresence mode="wait">
                  {sortedProducts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white dark:bg-[#222220] border border-border rounded-3xl p-16 text-center space-y-4"
                    >
                      <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto stroke-[1.25]" />
                      <h3 className="font-heading text-xl font-medium text-foreground">No matches found</h3>
                      <p className="text-xs text-muted-foreground font-sans max-w-sm mx-auto leading-relaxed">
                        We couldn&apos;t find any products matching your specific filters. Try expanding your price limit or clearing active swatches.
                      </p>
                      <Button
                        onClick={handleResetFilters}
                        className={`${DESIGN_SYSTEM.radius.button} bg-primary text-primary-foreground py-5 px-6 text-xs uppercase tracking-wider font-bold cursor-pointer mt-2`}
                      >
                        Clear All Filters
                      </Button>
                    </motion.div>
                  ) : viewMode === "grid" ? (
                    <motion.div
                      key={activeCategory + searchQuery + sortBy + priceRange + minRating + availability + selectedColor}
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer(0.03)}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {paginatedProducts.map((product) => (
                        <motion.div key={product.id} variants={slideUp(0.3, 15)}>
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    // List View Layout
                    <motion.div
                      key={activeCategory + searchQuery + sortBy + priceRange + minRating + availability + selectedColor + "-list"}
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer(0.03)}
                      className="space-y-4"
                    >
                      {paginatedProducts.map((product) => {
                        const isFav = isInWishlist(product.id);
                        return (
                          <motion.div
                            key={product.id}
                            variants={slideUp(0.3, 15)}
                            className="group bg-white dark:bg-[#222220] rounded-3xl border border-border overflow-hidden flex flex-col md:flex-row gap-6 p-4 hover:shadow-md transition-shadow duration-300"
                          >
                            {/* Left Image */}
                            <div className="relative w-full md:w-56 aspect-[4/5] md:aspect-square bg-[#F8F5F2] dark:bg-[#1C1C1A] rounded-2xl overflow-hidden shrink-0">
                              <Link href={`/products/${product.slug}`}>
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  sizes="224px"
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </Link>
                              
                              <button
                                onClick={() => handleWishlistToggle(product)}
                                className="absolute top-3 right-3 bg-white/95 dark:bg-[#222220]/95 p-2 rounded-full border border-border text-muted-foreground hover:text-destructive hover:scale-110 transition-all cursor-pointer shadow-xs"
                              >
                                <Heart className={cn("w-3.5 h-3.5", isFav ? "fill-destructive text-destructive" : "stroke-[1.5]")} />
                              </button>
                            </div>

                            {/* Right Metadata */}
                            <div className="flex-1 flex flex-col justify-between py-2">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <span className="text-[9px] uppercase tracking-wider text-accent font-semibold">{product.category}</span>
                                    <h4 className="font-sans font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                                    </h4>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-base font-bold text-foreground">${product.salePrice ?? product.price}</div>
                                    {product.salePrice && (
                                      <div className="text-xs text-muted-foreground line-through">${product.price}</div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 font-light leading-relaxed max-w-xl">
                                  {product.shortDescription}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                                  <span className="font-semibold text-foreground">{product.rating}</span>
                                  <span>({product.reviewsCount} reviews)</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <Button
                                  disabled={product.stock === 0}
                                  onClick={() => {
                                    addToCart(product, 1);
                                    toast.success(`${product.name} added to cart!`);
                                  }}
                                  className={`${DESIGN_SYSTEM.radius.button} px-6 py-5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold tracking-widest uppercase flex items-center gap-2 cursor-pointer disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed`}
                                >
                                  <ShoppingBag className="w-4 h-4" /> Add to Bag
                                </Button>
                                {product.stock === 0 ? (
                                  <span className="text-xs font-semibold text-destructive">Out of Stock</span>
                                ) : product.stock <= 3 ? (
                                  <span className="text-xs font-semibold text-amber-600">Only {product.stock} items left!</span>
                                ) : (
                                  <span className="text-xs text-emerald-600 font-medium">In Stock</span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-6 border-t border-border/60">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="border-border bg-white dark:bg-[#222220] p-3 rounded-xl disabled:opacity-50 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={cn(
                          "w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer",
                          currentPage === p
                            ? "bg-primary text-primary-foreground shadow-2xs scale-105"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        {p}
                      </button>
                    ))}

                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="border-border bg-white dark:bg-[#222220] p-3 rounded-xl disabled:opacity-50 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Mobile Collapsible Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white dark:bg-[#222220] z-50 p-6 overflow-y-auto rounded-l-3xl shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="font-heading text-lg font-semibold text-foreground">Filter Catalog</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderFilterSidebar()}
              </div>
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                className={`${DESIGN_SYSTEM.radius.button} w-full py-5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest mt-6 cursor-pointer`}
              >
                Apply Filters
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen pt-32 pb-16 bg-[#FAFAF8] dark:bg-[#181816] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <ProductsPageContent />
    </React.Suspense>
  );
}
