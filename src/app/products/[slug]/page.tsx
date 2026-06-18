import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMockProductBySlug, getMockProducts } from "@/data/mockProducts";
import ProductDetailClient from "./ProductDetailClient";

// Props interface with Promise params according to Next.js 15 specifications
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO optimization
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found - Antigravity Library",
      description: "The requested literary volume could not be found in our catalog.",
    };
  }

  return {
    title: `${product.name} by ${product.author} | Antigravity Library`,
    description: `${product.description.substring(0, 160)}... Purchase high-end outdoors literature.`,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "books.book",
      images: [
        {
          url: "/api/og?title=" + encodeURIComponent(product.name),
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getMockProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Find related products matching any tag (excluding current product)
  const allProducts = getMockProducts();
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        p.theme_tags.some((tag) => product.theme_tags.includes(tag))
    )
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Back button */}
      <div className="mb-8 animate-fade-in">
        <Link
          href="/products"
          className="text-xs text-cream-muted hover:text-gold transition-luxury uppercase tracking-widest flex items-center space-x-1"
        >
          <span>← Back to Catalog</span>
        </Link>
      </div>

      {/* Product Details Section (Client Component for cart state integration) */}
      <ProductDetailClient product={product} />

      {/* Related Books Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-gold-subtle/10 pt-16 animate-slide-up">
          <h2 className="font-serif text-2xl text-cream font-light tracking-wide mb-8 text-center sm:text-left">
            Compelling Companions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {relatedProducts.map((relProduct) => {
              const bgTheme = relProduct.images[0] || "#0B1916";
              const borderTheme = relProduct.images[1] || "#D4AF37";
              
              return (
                <div
                  key={relProduct.id}
                  className="group bg-forest/5 border border-gold-subtle/5 hover:border-gold-subtle/20 rounded p-4 flex flex-col transition-luxury"
                >
                  <Link href={`/products/${relProduct.slug}`} className="flex flex-col h-full">
                    {/* Tiny cover preview */}
                    <div className="aspect-[3/4] bg-midnight flex items-center justify-center p-4 rounded border border-gold-subtle/10 mb-4 overflow-hidden relative">
                      <div
                        className="absolute inset-1 flex flex-col justify-between p-3 border rounded transition-luxury group-hover:scale-105"
                        style={{
                          backgroundColor: bgTheme,
                          borderColor: `${borderTheme}20`,
                        }}
                      >
                        <span
                          className="text-[8px] uppercase font-bold tracking-[0.15em]"
                          style={{ color: borderTheme }}
                        >
                          Library
                        </span>
                        <h4 className="font-serif text-xs font-light text-cream leading-snug line-clamp-3">
                          {relProduct.name}
                        </h4>
                        <div className="text-[8px] text-cream-muted line-clamp-1">
                          By {relProduct.author}
                        </div>
                      </div>
                      <div className="absolute top-1 bottom-1 left-1 w-1 bg-black/30 blur-[0.5px] rounded-l" />
                    </div>

                    <h3 className="font-serif text-sm text-cream font-light line-clamp-1 group-hover:text-gold transition-luxury">
                      {relProduct.name}
                    </h3>
                    <p className="text-xs text-cream-muted mb-2 font-light">
                      By {relProduct.author}
                    </p>
                    <span className="text-xs text-gold font-medium font-serif mt-auto">
                      ${relProduct.price.toFixed(2)}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
