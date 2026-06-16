"use client";

import React, { useState } from "react";
import { Product, useCart } from "@/context/CartContext";
import { PlusIcon, MinusIcon, StarIcon } from "@/components/icons";

interface ClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ClientProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const bgTheme = product.images[0] || "#0B1916";
  const borderTheme = product.images[1] || "#D4AF37";

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start font-sans animate-fade-in">
      {/* Left Column: Premium Book Cover */}
      <div className="flex justify-center md:sticky md:top-24">
        <div className="relative w-full max-w-sm aspect-[3/4] bg-midnight flex items-center justify-center p-8 rounded border border-gold-subtle/10 shadow-2xl overflow-hidden">
          {/* Main Book Cover */}
          <div
            className="absolute inset-4 flex flex-col justify-between p-6 border rounded shadow-2xl transition-luxury"
            style={{
              backgroundColor: bgTheme,
              borderColor: `${borderTheme}30`,
            }}
          >
            <div className="space-y-2 text-center">
              <span
                className="text-xs uppercase font-bold tracking-[0.25em]"
                style={{ color: borderTheme }}
              >
                Antigravity Edition
              </span>
              <div className="h-px w-12 bg-gold/20 mx-auto my-2" />
              <h1 className="font-serif text-xl sm:text-2xl font-light text-cream leading-tight">
                {product.name}
              </h1>
            </div>
            
            <div className="text-center space-y-2">
              <div className="h-[1px] bg-gold-subtle/20 w-8 mx-auto" />
              <div className="text-xs text-cream-muted font-light">
                By {product.author}
              </div>
            </div>
          </div>

          {/* Book Spine Realism Shadows */}
          <div className="absolute top-4 bottom-4 left-4 w-2 bg-black/35 blur-[1px] rounded-l" />
          <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-white/5" />
        </div>
      </div>

      {/* Right Column: Metadata details & checkout */}
      <div className="space-y-8">
        <div className="space-y-2">
          {/* Tag labels */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-xs font-semibold text-gold tracking-widest uppercase border border-gold/30 px-3 py-1 rounded-full bg-forest/20">
              {product.genre}
            </span>
            {product.theme_tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-light text-cream-muted tracking-wide bg-sage/20 px-3 py-1 rounded-full"
              >
                {tag.replace("-", " ").toUpperCase()}
              </span>
            ))}
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-cream tracking-wide">
            {product.name}
          </h1>
          <p className="text-sm text-gold font-light tracking-wider">
            By <span className="underline cursor-pointer">{product.author}</span>
          </p>
        </div>

        {/* Reviews indicator */}
        <div className="flex items-center space-x-2 text-gold">
          <div className="flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} size={14} className="fill-current" />
            ))}
          </div>
          <span className="text-xs text-cream-muted font-light">(12 Reviews)</span>
        </div>

        {/* Description */}
        <p className="text-sm text-cream-muted leading-relaxed font-light">
          {product.description}
        </p>

        {/* Pricing & Stock */}
        <div className="flex items-center justify-between border-t border-b border-gold-subtle/20 py-4">
          <div>
            <span className="text-[10px] text-cream-muted tracking-widest uppercase block mb-1">
              Curated Price
            </span>
            <span className="font-serif text-2xl text-gold font-semibold">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-cream-muted tracking-widest uppercase block mb-1">
              Availability
            </span>
            <span className="text-xs text-cream font-light">
              {product.stock === 0 ? (
                <span className="text-red-400 font-semibold">Out of Stock</span>
              ) : product.stock <= 3 ? (
                <span className="text-gold font-semibold">Limited Stock ({product.stock})</span>
              ) : (
                <span className="text-emerald-400">Available ({product.stock})</span>
              )}
            </span>
          </div>
        </div>

        {/* Add to Bag Controls */}
        {product.stock > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-cream-muted uppercase tracking-wider">
                Quantity
              </span>
              
              {/* Quantity clickers */}
              <div className="flex items-center border border-gold-subtle rounded bg-forest">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-cream-muted hover:text-gold transition-luxury cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon size={14} />
                </button>
                <span className="px-4 text-sm font-medium text-cream">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-cream-muted hover:text-gold transition-luxury cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <PlusIcon size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-sm font-serif font-semibold tracking-widest uppercase border transition-luxury cursor-pointer ${
                isAdded
                  ? "bg-emerald-600 text-cream border-emerald-600"
                  : "bg-gold text-midnight border-gold hover:bg-gold-light"
              }`}
            >
              {isAdded ? "Added to Selection" : "Add to Cart"}
            </button>
          </div>
        )}

        {/* Product Specifications Table */}
        <div className="space-y-4 pt-4 border-t border-gold-subtle/10">
          <h3 className="text-xs font-semibold text-gold tracking-widest uppercase">
            Product Specifications
          </h3>
          <dl className="grid grid-cols-2 gap-y-3 text-xs leading-relaxed">
            <dt className="text-cream-muted font-light">Binding</dt>
            <dd className="text-cream font-light text-right">Gold-debossed Linen Hardcover</dd>

            <dt className="text-cream-muted font-light">Dimensions</dt>
            <dd className="text-cream font-light text-right">6.00" x 9.00" x 1.25"</dd>

            <dt className="text-cream-muted font-light">Page Count</dt>
            <dd className="text-cream font-light text-right">324 pages</dd>

            <dt className="text-cream-muted font-light">Paper Type</dt>
            <dd className="text-cream font-light text-right">80gsm acid-free cream paper</dd>

            <dt className="text-cream-muted font-light">ISBN</dt>
            <dd className="text-cream font-light text-right">978-1-897531-{product.id.slice(-4)}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
