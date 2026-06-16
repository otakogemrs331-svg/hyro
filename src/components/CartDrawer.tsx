"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CloseIcon, TrashIcon, PlusIcon, MinusIcon, TagIcon } from "./icons";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    applyDiscountCode,
    removeDiscountCode,
    appliedDiscount,
    subtotal,
    discountAmount,
    taxAmount,
    shippingAmount,
    total,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess(false);

    if (!promoCode.trim()) return;

    const success = applyDiscountCode(promoCode);
    if (success) {
      setPromoSuccess(true);
      setPromoCode("");
    } else {
      setPromoError("Invalid discount code. Try 'GOLD15' or 'FOREST10'.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-midnight border-l border-gold-subtle flex flex-col shadow-2xl animate-fade-in">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gold-subtle flex items-center justify-between">
            <h2 className="text-xl font-serif font-light text-cream tracking-wide">
              Your Selection <span className="text-sm font-sans text-gold">({cartItems.length})</span>
            </h2>
            <button
              onClick={onClose}
              className="text-cream-muted hover:text-gold transition-luxury p-1 rounded-full hover:bg-sage/20"
              aria-label="Close cart"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full border border-gold-subtle flex items-center justify-center text-gold/60">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-lg text-cream font-light">The bag is empty</h3>
                <p className="text-sm text-cream-muted max-w-xs">
                  Fill it with carefully curated literature for your next expedition.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 border border-gold text-gold hover:bg-gold hover:text-midnight transition-luxury text-sm font-semibold tracking-wider uppercase"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start py-4 border-b border-gold-subtle/50 last:border-b-0 space-x-4 animate-slide-up"
                >
                  {/* Mock Book Cover image representation */}
                  <div className="w-16 h-24 flex-shrink-0 bg-gradient-to-br from-sage to-forest border border-gold/20 flex flex-col justify-between p-2 shadow-md rounded">
                    <div className="text-[7px] text-gold font-bold uppercase tracking-wider line-clamp-2">
                      {item.product.name}
                    </div>
                    <div className="text-[6px] text-cream-muted line-clamp-1">
                      {item.product.author}
                    </div>
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-serif text-cream font-light tracking-wide line-clamp-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={onClose}
                        className="hover:text-gold transition-luxury"
                      >
                        {item.product.name}
                      </Link>
                    </h4>
                    <p className="text-xs text-cream-muted mb-2">{item.product.author}</p>
                    <div className="flex items-center justify-between">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-gold-subtle rounded bg-forest">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-cream-muted hover:text-gold transition-luxury"
                        >
                          <MinusIcon size={12} />
                        </button>
                        <span className="px-2 text-xs text-cream">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-cream-muted hover:text-gold transition-luxury"
                        >
                          <PlusIcon size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-cream-muted hover:text-red-400 transition-luxury p-1"
                        aria-label="Remove item"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="text-sm text-gold font-medium font-serif">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-cream-muted mt-0.5">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations Section */}
          {cartItems.length > 0 && (
            <div className="border-t border-gold-subtle px-6 py-6 bg-forest/40 space-y-6">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-midnight/80 border border-gold-subtle/40 rounded px-3 py-2 text-xs text-cream focus:outline-none focus:border-gold transition-luxury uppercase tracking-wider"
                  />
                  {appliedDiscount && (
                    <button
                      type="button"
                      onClick={removeDiscountCode}
                      className="absolute right-2.5 top-2.5 text-[10px] text-gold hover:text-red-400 transition-luxury flex items-center space-x-0.5"
                    >
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-sage text-cream hover:bg-gold hover:text-midnight border border-gold-subtle px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-luxury"
                >
                  Apply
                </button>
              </form>

              {promoError && <p className="text-xs text-red-400 font-sans">{promoError}</p>}
              {promoSuccess && (
                <p className="text-xs text-gold font-sans flex items-center">
                  <TagIcon size={14} className="mr-1" /> Code applied successfully!
                </p>
              )}
              {appliedDiscount && !promoSuccess && (
                <p className="text-xs text-gold/80 font-sans flex items-center">
                  <TagIcon size={14} className="mr-1" /> Code '{appliedDiscount.code}' applied ({appliedDiscount.value}
                  {appliedDiscount.type === "percentage" ? "%" : "$"} off).
                </p>
              )}

              {/* Price Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-cream-muted">
                  <span>Subtotal</span>
                  <span className="font-serif">${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-gold">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span className="font-serif">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-cream-muted">
                  <span>Sales Tax (8.25%)</span>
                  <span className="font-serif">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cream-muted">
                  <span>Premium Courier Shipping</span>
                  <span className="font-serif">
                    {shippingAmount === 0 ? "Complimentary" : `$${shippingAmount.toFixed(2)}`}
                  </span>
                </div>
                <div className="h-px bg-gold-subtle/30 my-4" />
                <div className="flex justify-between text-cream font-medium">
                  <span className="text-base tracking-wide font-serif">Total Value</span>
                  <span className="text-lg text-gold font-serif font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full flex items-center justify-center bg-gold text-midnight hover:bg-gold-light border border-gold font-serif py-3 text-sm font-semibold tracking-widest uppercase transition-luxury shadow-lg"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
