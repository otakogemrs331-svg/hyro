import React from "react";
import Link from "next/link";
import { getMockProducts } from "@/data/mockProducts";
import { ChevronRightIcon, BookOpenIcon, StarIcon } from "@/components/icons";

export default function HomePage() {
  // Select top 3 books for featured showcase
  const featuredBooks = getMockProducts().slice(0, 3);

  return (
    <div className="font-sans min-h-screen text-cream flex flex-col bg-midnight">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center border-b border-gold-subtle/15 bg-gradient-to-b from-forest via-midnight to-midnight overflow-hidden">
        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-midnight/50 to-midnight" />

        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-8 animate-fade-in">
          <span className="text-xs sm:text-sm font-semibold tracking-[0.4em] text-gold uppercase animate-pulse">
            Introducing the Antigravity Library
          </span>
          
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-cream tracking-wide leading-tight animate-slide-up">
            Literature Crafted for <br />
            <span className="font-serif italic text-gold">Wilderness Explorers</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-cream-muted max-w-2xl mx-auto font-light leading-relaxed">
            A hand-bound selection of navigational guides, botanical manuals, and outdoor memoirs. Designed as silent companions for campfires, summits, and deep woods.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 bg-gold text-midnight hover:bg-gold-light font-serif text-sm font-semibold tracking-widest uppercase transition-luxury shadow-lg"
            >
              Explore Collection
            </Link>
            <Link
              href="/blog"
              className="w-full sm:w-auto px-8 py-3.5 border border-gold-subtle/40 hover:border-gold text-cream hover:bg-sage/10 text-xs font-semibold tracking-widest uppercase transition-luxury"
            >
              Read Editorial Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Values / Organic Nature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-gold-subtle/10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream font-light tracking-wide">
            Designed for the Field, Cherished for Generations
          </h2>
          <div className="w-12 h-px bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4 p-6 bg-forest/10 border border-gold-subtle/5 rounded transition-luxury hover:border-gold-subtle/20">
            <div className="w-12 h-12 rounded-full border border-gold-subtle flex items-center justify-center text-gold mx-auto mb-4">
              <BookOpenIcon size={22} />
            </div>
            <h3 className="font-serif text-lg text-cream font-light">Gold-Debossed Hardcovers</h3>
            <p className="text-xs text-cream-muted leading-relaxed font-light">
              Crafted in fine linen cloth bindings, debossed with metallic gold foils. Beautiful on your library shelf, robust enough for your backpack.
            </p>
          </div>

          <div className="space-y-4 p-6 bg-forest/10 border border-gold-subtle/5 rounded transition-luxury hover:border-gold-subtle/20">
            <div className="w-12 h-12 rounded-full border border-gold-subtle flex items-center justify-center text-gold mx-auto mb-4">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.158-.343.457-.59.82-.648a1.124 1.124 0 0 1 1.291.996L13.88 5.6a.75.75 0 0 1-.22.536l-1.15 1.15a.75.75 0 0 1-.537.22h-1.89a.75.75 0 0 1-.537-.22L8.39 6.136a.75.75 0 0 1-.22-.537l.29-1.753a1.125 1.125 0 0 1 1.291-.996c.363.058.662.305.82.648L11.48 3.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h16.5M3.75 18h16.5M3.75 9H20.25M6.75 6h10.5" />
              </svg>
            </div>
            <h3 className="font-serif text-lg text-cream font-light">Acid-Free Archival Paper</h3>
            <p className="text-xs text-cream-muted leading-relaxed font-light">
              We print exclusively on heavyweight 80gsm cream-toned paper. Resists yellowing and aging, guaranteeing your annotations endure.
            </p>
          </div>

          <div className="space-y-4 p-6 bg-forest/10 border border-gold-subtle/5 rounded transition-luxury hover:border-gold-subtle/20">
            <div className="w-12 h-12 rounded-full border border-gold-subtle flex items-center justify-center text-gold mx-auto mb-4">
              <StarIcon size={22} className="text-gold" />
            </div>
            <h3 className="font-serif text-lg text-cream font-light">Field-Tested Integrity</h3>
            <p className="text-xs text-cream-muted leading-relaxed font-light">
              Every guidebook layout and safety checklist is vetted by experienced mountaineers, certifying that our advice is as secure as it is inspiring.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-gold-subtle/10">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-16">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-bold text-gold tracking-widest uppercase">Curated Catalog</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-cream font-light tracking-wide">
              Featured Volumes
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs text-cream-muted hover:text-gold uppercase tracking-widest flex items-center space-x-1 mt-4 sm:mt-0 group"
          >
            <span>View All Volumes</span>
            <ChevronRightIcon size={14} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBooks.map((product) => {
            const bgTheme = product.images[0] || "#0B1916";
            const borderTheme = product.images[1] || "#D4AF37";
            
            return (
              <div
                key={product.id}
                className="group flex flex-col bg-forest/10 border border-gold-subtle/5 hover:border-gold-subtle/20 rounded p-5 transition-luxury"
              >
                <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
                  {/* Styled Book Cover */}
                  <div className="aspect-[3/4] bg-midnight flex items-center justify-center p-6 rounded border border-gold-subtle/10 mb-6 overflow-hidden relative shadow-md">
                    <div
                      className="absolute inset-2 flex flex-col justify-between p-4 border rounded transition-luxury group-hover:scale-105"
                      style={{
                        backgroundColor: bgTheme,
                        borderColor: `${borderTheme}20`,
                      }}
                    >
                      <div className="space-y-1">
                        <span
                          className="text-[9px] uppercase font-bold tracking-[0.2em]"
                          style={{ color: borderTheme }}
                        >
                          Antigravity
                        </span>
                        <h4 className="font-serif text-sm font-light text-cream leading-tight line-clamp-3">
                          {product.name}
                        </h4>
                      </div>
                      <div className="text-[9px] text-cream-muted line-clamp-1">
                        By {product.author}
                      </div>
                    </div>
                    <div className="absolute top-2 bottom-2 left-2 w-1.5 bg-black/30 blur-[1px] rounded-l" />
                  </div>

                  <h3 className="font-serif text-lg text-cream font-light tracking-wide line-clamp-1 group-hover:text-gold transition-luxury">
                    {product.name}
                  </h3>
                  <p className="text-xs text-cream-muted mb-4 font-light">
                    By {product.author}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gold-subtle/10 mt-auto">
                    <span className="font-serif text-gold font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-cream-muted font-light uppercase tracking-wider">
                      Read Details →
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial Stories Callout Banner */}
      <section className="relative py-24 bg-forest/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.05)_0%,transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative">
          <span className="text-[10px] font-bold text-gold tracking-widest uppercase">The Editorial Stories</span>
          <h2 className="font-serif text-2xl sm:text-4xl text-cream font-light tracking-wide">
            Trail Diaries & Reading Lists
          </h2>
          <p className="text-xs sm:text-sm text-cream-muted max-w-xl mx-auto font-light leading-relaxed">
            Read our latest trail reports, recommended hiking route pairings, and philosophical reflections written from deep woods outposts.
          </p>
          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-midnight text-xs font-semibold tracking-widest uppercase transition-luxury"
            >
              Enter Stories Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
