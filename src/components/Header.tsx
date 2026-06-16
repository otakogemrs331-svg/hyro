"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { SearchIcon, BagIcon, UserIcon, MenuIcon, CloseIcon } from "./icons";
import { CartDrawer } from "./CartDrawer";

export const Header: React.FC = () => {
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-40 bg-midnight/80 backdrop-blur-md border-b border-gold-subtle font-sans transition-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Desktop Navigation Left */}
            <nav className="hidden md:flex space-x-8 text-xs font-semibold tracking-widest uppercase">
              <Link href="/products" className="text-cream-muted hover:text-gold transition-luxury luxury-underline">
                Store
              </Link>
              <Link href="/blog" className="text-cream-muted hover:text-gold transition-luxury luxury-underline">
                Stories
              </Link>
              <Link href="/admin" className="text-cream-muted hover:text-gold transition-luxury luxury-underline">
                Portal
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-cream-muted hover:text-gold p-2 transition-luxury"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
              </button>
            </div>

            {/* Brand Logo - Centered */}
            <div className="flex-1 md:flex-none flex justify-center">
              <Link href="/" className="flex flex-col items-center">
                <span className="font-serif text-2xl sm:text-3xl font-light text-cream tracking-[0.25em] uppercase hover:text-gold transition-luxury">
                  Antigravity
                </span>
                <span className="text-[8px] text-gold font-bold tracking-[0.4em] uppercase -mt-0.5">
                  Outdoor Library
                </span>
              </Link>
            </div>

            {/* Actions Right */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              {/* Search Trigger */}
              <button
                className="text-cream-muted hover:text-gold p-2 transition-luxury cursor-pointer"
                aria-label="Search catalog"
              >
                <SearchIcon size={20} />
              </button>

              {/* Admin Icon link */}
              <Link
                href="/admin"
                className="text-cream-muted hover:text-gold p-2 transition-luxury hidden sm:inline-block"
                aria-label="Admin Portal"
              >
                <UserIcon size={20} />
              </Link>

              {/* Cart Toggle */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-cream-muted hover:text-gold p-2 transition-luxury relative cursor-pointer"
                aria-label="Open cart selection"
              >
                <BagIcon size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-sans font-bold text-midnight shadow animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-forest border-b border-gold-subtle animate-fade-in">
            <div className="px-4 pt-2 pb-6 space-y-4 text-center text-sm font-serif tracking-widest uppercase flex flex-col">
              <Link
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className="text-cream-muted hover:text-gold py-2.5 transition-luxury border-b border-gold-subtle/20"
              >
                Store
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="text-cream-muted hover:text-gold py-2.5 transition-luxury border-b border-gold-subtle/20"
              >
                Stories
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="text-cream-muted hover:text-gold py-2.5 transition-luxury"
              >
                Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Slider */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
