"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getMockProducts, getMockCategories, Category } from "@/data/mockProducts";
import { Product, useCart } from "@/context/CartContext";
import { SearchIcon, StarIcon, PlusIcon } from "@/components/icons";

const ProductListContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states loaded from searchParams
  const selectedTheme = searchParams.get("theme") || "all";
  const selectedGenre = searchParams.get("genre") || "all";

  useEffect(() => {
    setProducts(getMockProducts());
    setCategories(getMockCategories());
    
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  // Handle filter changes by updating router query params
  const updateFilters = (newTheme: string, newGenre: string, queryText?: string) => {
    const params = new URLSearchParams();
    if (newTheme !== "all") params.set("theme", newTheme);
    if (newGenre !== "all") params.set("genre", newGenre);
    
    const q = queryText !== undefined ? queryText : searchQuery;
    if (q.trim()) params.set("q", q.trim());
    
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(selectedTheme, selectedGenre, searchQuery);
  };

  const clearFilters = () => {
    setSearchQuery("");
    router.push("/products");
  };

  // Process filters
  const filteredProducts = products.filter((p) => {
    // Search query matches product name, author, or genre
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    if (query) {
      const matchName = p.name.toLowerCase().includes(query);
      const matchAuthor = p.author.toLowerCase().includes(query);
      const matchGenre = p.genre.toLowerCase().includes(query);
      if (!matchName && !matchAuthor && !matchGenre) return false;
    }

    // Theme filter
    if (selectedTheme !== "all" && !p.theme_tags.includes(selectedTheme)) {
      return false;
    }

    // Genre/Category filter
    if (selectedGenre !== "all") {
      const matchedCat = categories.find((c) => c.slug === selectedGenre);
      if (matchedCat && p.category_id !== matchedCat.id) return false;
    }

    return true;
  });

  const getThemeLabel = (tag: string) => {
    switch (tag) {
      case "trail-reading": return "Trail Reading";
      case "survival": return "Survival Manual";
      case "deep-woods": return "Deep Woods";
      default: return tag;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans min-h-screen">
      {/* Page Header */}
      <div className="text-center space-y-4 mb-16 animate-fade-in">
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-cream tracking-wide">
          The Curated Wilderness Library
        </h1>
        <p className="text-sm sm:text-base text-cream-muted max-w-2xl mx-auto font-light leading-relaxed">
          Explore our handpicked collection of manual guides, survival fieldnotes, and literary reflections crafted for the wild.
        </p>
        <div className="w-16 h-px bg-gold mx-auto mt-6" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <aside className="space-y-8 bg-forest/30 border border-gold-subtle/20 rounded p-6 lg:sticky lg:top-24">
          <div>
            <h2 className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">Search Catalog</h2>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Title, Author, Genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-midnight border border-gold-subtle/30 rounded pl-3 pr-10 py-2 text-xs text-cream focus:outline-none focus:border-gold transition-luxury uppercase tracking-wider"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 text-cream-muted hover:text-gold transition-luxury"
                aria-label="Submit search"
              >
                <SearchIcon size={16} />
              </button>
            </form>
          </div>

          {/* Theme Filter */}
          <div>
            <h2 className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">Outdoor Theme</h2>
            <div className="flex flex-col space-y-2 text-xs">
              {["all", "trail-reading", "survival", "deep-woods"].map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateFilters(theme, selectedGenre)}
                  className={`text-left py-1.5 px-2.5 rounded transition-luxury ${
                    selectedTheme === theme
                      ? "bg-sage text-cream font-medium border border-gold/30"
                      : "text-cream-muted hover:text-gold hover:bg-forest/50"
                  }`}
                >
                  {theme === "all" ? "All Themes" : getThemeLabel(theme)}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Filter */}
          <div>
            <h2 className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">Genre / Category</h2>
            <div className="flex flex-col space-y-2 text-xs">
              <button
                onClick={() => updateFilters(selectedTheme, "all")}
                className={`text-left py-1.5 px-2.5 rounded transition-luxury ${
                  selectedGenre === "all"
                    ? "bg-sage text-cream font-medium border border-gold/30"
                    : "text-cream-muted hover:text-gold hover:bg-forest/50"
                }`}
              >
                All Genres
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilters(selectedTheme, cat.slug)}
                  className={`text-left py-1.5 px-2.5 rounded transition-luxury ${
                    selectedGenre === cat.slug
                      ? "bg-sage text-cream font-medium border border-gold/30"
                      : "text-cream-muted hover:text-gold hover:bg-forest/50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedTheme !== "all" || selectedGenre !== "all" || searchQuery.trim()) && (
            <button
              onClick={clearFilters}
              className="w-full py-2 border border-red-400/30 text-red-400 hover:bg-red-400/10 rounded text-xs font-semibold tracking-wider uppercase transition-luxury"
            >
              Reset Filters
            </button>
          )}
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-gold-subtle/20 rounded space-y-4">
              <p className="text-cream-muted text-sm font-light">No volumes found matching the current selections.</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-midnight text-xs font-semibold tracking-widest uppercase transition-luxury"
              >
                Show All Books
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const bgTheme = product.images[0] || "#0B1916";
                const borderTheme = product.images[1] || "#D4AF37";
                
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-forest/15 border border-gold-subtle/10 hover:border-gold-subtle/30 rounded p-4 transition-luxury shadow hover:shadow-xl animate-slide-up"
                  >
                    {/* Fictional Premium Book Cover Container */}
                    <div className="relative aspect-[3/4] bg-midnight flex items-center justify-center p-6 mb-6 rounded shadow-inner overflow-hidden border border-gold-subtle/10">
                      {/* Stylized background representing book cover */}
                      <div
                        className="absolute inset-2 flex flex-col justify-between p-4 border rounded transition-luxury group-hover:scale-105"
                        style={{
                          backgroundColor: bgTheme,
                          borderColor: `${borderTheme}30`
                        }}
                      >
                        {/* Book title and gold branding */}
                        <div className="space-y-1">
                          <div
                            className="text-[10px] uppercase font-bold tracking-[0.2em]"
                            style={{ color: borderTheme }}
                          >
                            Antigravity
                          </div>
                          <h3 className="font-serif text-sm sm:text-base font-light text-cream leading-tight line-clamp-3">
                            {product.name}
                          </h3>
                        </div>
                        <div className="space-y-1">
                          <div className="h-[1px] bg-gold-subtle/20 w-8" />
                          <div className="text-[10px] text-cream-muted font-light line-clamp-1">
                            By {product.author}
                          </div>
                        </div>
                      </div>

                      {/* Cover spine shadow overlay for realism */}
                      <div className="absolute top-2 bottom-2 left-2 w-1.5 bg-black/30 blur-[1px] rounded-l" />
                      
                      {/* Floating Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="absolute bottom-4 right-4 bg-gold text-midnight p-2.5 rounded-full hover:bg-gold-light opacity-0 group-hover:opacity-100 transition-luxury shadow-lg cursor-pointer transform translate-y-2 group-hover:translate-y-0"
                        title="Add to bag"
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>

                    {/* Book Metadata details */}
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Genre and theme labels */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-[9px] font-semibold text-gold tracking-wider uppercase border border-gold/20 px-2 py-0.5 rounded-full">
                            {product.genre}
                          </span>
                          {product.theme_tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-light text-cream-muted tracking-wide bg-sage/20 px-2 py-0.5 rounded-full"
                            >
                              {getThemeLabel(tag)}
                            </span>
                          ))}
                        </div>
                        
                        <h2 className="font-serif text-lg text-cream font-light tracking-wide line-clamp-1 group-hover:text-gold transition-luxury">
                          <Link href={`/products/${product.slug}`}>
                            {product.name}
                          </Link>
                        </h2>
                        
                        <p className="text-xs text-cream-muted line-clamp-2 mt-1 font-light leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gold-subtle/10 mt-auto">
                        <span className="font-serif text-gold text-base font-semibold">
                          ${product.price.toFixed(2)}
                        </span>
                        
                        <span className="text-[10px] text-cream-muted font-light">
                          {product.stock <= 3
                            ? `Only ${product.stock} left`
                            : `In stock (${product.stock})`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default function ProductListPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
        <p className="text-xs text-cream-muted mt-4 uppercase tracking-widest">Loading Library Catalog...</p>
      </div>
    }>
      <ProductListContent />
    </Suspense>
  );
}
