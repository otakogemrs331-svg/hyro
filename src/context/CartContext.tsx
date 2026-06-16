"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  author: string;
  genre: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  theme_tags: string[];
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DiscountCode {
  code: string;
  type: "percentage" | "fixed";
  value: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  appliedDiscount: DiscountCode | null;
  
  // Calculations
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Mock list of active discount codes for local simulation
const MOCK_DISCOUNTS: DiscountCode[] = [
  { code: "GOLD15", type: "percentage", value: 15 }, // 15% off
  { code: "FOREST10", type: "fixed", value: 10 },    // $10 off
  { code: "WILD30", type: "percentage", value: 30 }  // 30% off
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("antigravity_cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      const storedDiscount = localStorage.getItem("antigravity_discount");
      if (storedDiscount) {
        setAppliedDiscount(JSON.parse(storedDiscount));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("antigravity_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems, isInitialized]);

  // Save discount to localStorage on changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (appliedDiscount) {
        localStorage.setItem("antigravity_discount", JSON.stringify(appliedDiscount));
      } else {
        localStorage.removeItem("antigravity_discount");
      }
    } catch (e) {
      console.error("Failed to save discount to localStorage", e);
    }
  }, [appliedDiscount, isInitialized]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        // Enforce stock limit
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedDiscount(null);
  };

  const applyDiscountCode = (code: string): boolean => {
    const formattedCode = code.trim().toUpperCase();
    const discount = MOCK_DISCOUNTS.find((d) => d.code === formattedCode);
    if (discount) {
      setAppliedDiscount(discount);
      return true;
    }
    return false;
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === "percentage") {
      discountAmount = (subtotal * appliedDiscount.value) / 100;
    } else {
      discountAmount = Math.min(appliedDiscount.value, subtotal);
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  
  // Tax is 8.25% of the discounted subtotal
  const taxAmount = parseFloat((discountedSubtotal * 0.0825).toFixed(2));
  
  // Free premium shipping if discounted subtotal > $150, otherwise $15 flat rate.
  // Shipping is $0 if cart is empty.
  const shippingAmount = cartItems.length === 0 ? 0 : discountedSubtotal >= 150 ? 0 : 15;
  
  const total = parseFloat((discountedSubtotal + taxAmount + shippingAmount).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyDiscountCode,
        removeDiscountCode,
        appliedDiscount,
        subtotal,
        discountAmount,
        taxAmount,
        shippingAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
