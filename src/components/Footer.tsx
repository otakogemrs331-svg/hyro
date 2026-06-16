"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckIcon } from "./icons";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API registration
    console.log(`Newsletter subscription registered for: ${email}`);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-forest border-t border-gold-subtle text-cream font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Description */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-xl font-light text-cream tracking-[0.2em] uppercase">
                Antigravity
              </span>
              <span className="text-[7px] text-gold font-bold tracking-[0.3em] uppercase">
                Outdoor Library
              </span>
            </Link>
            <p className="text-xs text-cream-muted leading-relaxed font-light">
              Crafting literary companions for trail explorers, deep forest seekers, and wilderness survivalists.
            </p>
          </div>

          {/* Collections */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest text-gold uppercase">Collections</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?theme=trail-reading" className="text-cream-muted hover:text-gold transition-luxury">
                  Trail Reading
                </Link>
              </li>
              <li>
                <Link href="/products?theme=survival" className="text-cream-muted hover:text-gold transition-luxury">
                  Survival Manuals
                </Link>
              </li>
              <li>
                <Link href="/products?theme=deep-woods" className="text-cream-muted hover:text-gold transition-luxury">
                  Deep Woods Memoirs
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest text-gold uppercase">Library Services</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/blog" className="text-cream-muted hover:text-gold transition-luxury">
                  Editorial Stories
                </Link>
              </li>
              <li>
                <span className="text-cream-muted cursor-not-allowed">
                  Premium Delivery
                </span>
              </li>
              <li>
                <span className="text-cream-muted cursor-not-allowed">
                  Returns & Care
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest text-gold uppercase">Newsletter</h3>
            <p className="text-xs text-cream-muted font-light leading-relaxed">
              Subscribe to receive curated reading recommendations and wilderness digests.
            </p>
            {subscribed ? (
              <div className="flex items-center space-x-2 text-gold text-xs bg-sage/20 border border-gold-subtle/30 px-3 py-2.5 rounded">
                <CheckIcon size={14} className="text-gold flex-shrink-0" />
                <span className="font-light">Your submittal has been registered.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2 text-xs text-cream focus:outline-none focus:border-gold transition-luxury uppercase tracking-wider flex-1"
                  required
                />
                <button
                  type="submit"
                  className="bg-gold text-midnight hover:bg-gold-light font-semibold px-4 py-2 text-xs tracking-widest uppercase transition-luxury"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-16 pt-8 border-t border-gold-subtle/10 flex flex-col sm:flex-row items-center justify-between text-[10px] text-cream-muted font-light tracking-wide space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} ANTIGRAVITY. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-gold cursor-pointer transition-luxury">Privacy Policy</span>
            <span className="hover:text-gold cursor-pointer transition-luxury">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
