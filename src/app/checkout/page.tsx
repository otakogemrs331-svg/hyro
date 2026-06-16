"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { addMockOrder } from "@/data/mockOrders";
import { CheckIcon, TagIcon } from "@/components/icons";

type CheckoutStep = "shipping" | "payment" | "success";

export default function CheckoutPage() {
  const {
    cartItems,
    clearCart,
    subtotal,
    discountAmount,
    appliedDiscount,
    taxAmount,
    shippingAmount,
    total,
  } = useCart();

  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [placedOrderId, setPlacedOrderId] = useState("");
  
  // Shipping Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("United States");
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

  // Payment Form State
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!fullName) errors.fullName = "Full name is required";
    if (!email) errors.email = "Email is required";
    if (!address) errors.address = "Shipping address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State/Region is required";
    if (!zip) errors.zip = "Postal code is required";

    if (Object.keys(errors).length > 0) {
      setShippingErrors(errors);
      return;
    }

    setShippingErrors({});
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!cardHolder) errors.cardHolder = "Cardholder name is required";
    if (!cardNumber || cardNumber.length < 15) errors.cardNumber = "Enter a valid credit card number";
    if (!cardExpiry) errors.cardExpiry = "Expiry date is required";
    if (!cardCvc || cardCvc.length < 3) errors.cardCvc = "CVC is required";

    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      return;
    }

    setPaymentErrors({});

    // Write order to mock order registry
    const orderItems = cartItems.map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const newOrder = addMockOrder({
      items: orderItems,
      subtotal,
      discount_code: appliedDiscount?.code,
      discount_amount: discountAmount,
      tax: taxAmount,
      shipping: shippingAmount,
      total,
      shipping_details: {
        fullName,
        address,
        city,
        state,
        zip,
        country,
      },
    });

    // Trigger simulated tracking email
    console.log(`[SIMULATOR] Automated order tracking email sent to ${email} for order ${newOrder.id}`);

    setPlacedOrderId(newOrder.id);
    clearCart();
    setStep("success");
  };

  if (cartItems.length === 0 && step !== "success") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-sans space-y-4">
        <h1 className="font-serif text-2xl text-cream font-light">No items in checkout</h1>
        <p className="text-sm text-cream-muted">Your shopping cart is currently empty.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-2.5 bg-gold text-midnight hover:bg-gold-light text-xs font-semibold tracking-widest uppercase transition-luxury"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans min-h-screen">
      {/* Page header */}
      <div className="text-center space-y-2 mb-16 animate-fade-in">
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-cream tracking-wide">
          Secure Checkout
        </h1>
        <div className="flex items-center justify-center space-x-4 text-xs tracking-wider uppercase font-semibold">
          <span className={step === "shipping" ? "text-gold" : "text-cream-muted"}>Shipping</span>
          <span className="text-cream-muted/30">/</span>
          <span className={step === "payment" ? "text-gold" : "text-cream-muted"}>Payment</span>
          <span className="text-cream-muted/30">/</span>
          <span className={step === "success" ? "text-gold" : "text-cream-muted"}>Confirmation</span>
        </div>
      </div>

      {step !== "success" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Form Content Column */}
          <div className="lg:col-span-2 bg-forest/10 border border-gold-subtle/10 rounded p-6 sm:p-8 animate-slide-up">
            
            {/* Step 1: Shipping Details */}
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <h2 className="font-serif text-xl font-light text-cream mb-4 border-b border-gold-subtle/10 pb-2">
                  Shipping Destination
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury uppercase"
                    />
                    {shippingErrors.fullName && <p className="text-[10px] text-red-400">{shippingErrors.fullName}</p>}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury"
                    />
                    {shippingErrors.email && <p className="text-[10px] text-red-400">{shippingErrors.email}</p>}
                  </div>

                  <div className="sm:col-span-2 flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">Address Line 1</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury uppercase"
                    />
                    {shippingErrors.address && <p className="text-[10px] text-red-400">{shippingErrors.address}</p>}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury uppercase"
                    />
                    {shippingErrors.city && <p className="text-[10px] text-red-400">{shippingErrors.city}</p>}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">State / Region</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury uppercase"
                    />
                    {shippingErrors.state && <p className="text-[10px] text-red-400">{shippingErrors.state}</p>}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">Postal Code</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury uppercase"
                    />
                    {shippingErrors.zip && <p className="text-[10px] text-red-400">{shippingErrors.zip}</p>}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gold text-midnight hover:bg-gold-light border border-gold font-serif text-sm font-semibold tracking-widest uppercase transition-luxury"
                  >
                    Proceed to Payment Details
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Payment Simulator */}
            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <h2 className="font-serif text-xl font-light text-cream mb-4 border-b border-gold-subtle/10 pb-2">
                  Payment Details (Simulator)
                </h2>
                
                <div className="bg-sage/10 border border-gold-subtle/20 p-4 rounded text-xs text-gold/90 font-light leading-relaxed mb-6">
                  <strong>Developer Note:</strong> No real transaction processing takes place. You may enter any test credentials to finalize the purchase.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2 flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="MARCUS VALERIUS"
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury uppercase"
                    />
                    {paymentErrors.cardHolder && <p className="text-[10px] text-red-400">{paymentErrors.cardHolder}</p>}
                  </div>

                  <div className="sm:col-span-2 flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s+/g, ""))}
                      maxLength={16}
                      placeholder="4000 1234 5678 9010"
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury"
                    />
                    {paymentErrors.cardNumber && <p className="text-[10px] text-red-400">{paymentErrors.cardNumber}</p>}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury"
                    />
                    {paymentErrors.cardExpiry && <p className="text-[10px] text-red-400">{paymentErrors.cardExpiry}</p>}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] tracking-wider uppercase text-cream-muted">CVC Code</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                      maxLength={4}
                      placeholder="•••"
                      className="bg-midnight border border-gold-subtle/30 rounded px-3 py-2.5 text-xs text-cream focus:outline-none focus:border-gold transition-luxury"
                    />
                    {paymentErrors.cardCvc && <p className="text-[10px] text-red-400">{paymentErrors.cardCvc}</p>}
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="flex-1 py-3 border border-gold-subtle/40 text-cream-muted hover:border-gold transition-luxury text-xs font-semibold tracking-wider uppercase"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gold text-midnight hover:bg-gold-light border border-gold font-serif text-sm font-semibold tracking-widest uppercase transition-luxury"
                  >
                    Authorize Payment (${total.toFixed(2)})
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Pricing Summary Column */}
          <div className="bg-forest/5 border border-gold-subtle/15 rounded p-6 space-y-6">
            <h2 className="font-serif text-lg text-cream font-light border-b border-gold-subtle/10 pb-2 tracking-wide">
              Summary Details
            </h2>

            {/* Cart Items list */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-xs">
                  <div className="min-w-0 flex-1 pr-4">
                    <h4 className="text-cream-muted font-light truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-cream-muted/60 mt-0.5">
                      {item.quantity} x ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-serif text-gold font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gold-subtle/25" />

            {/* Price Details */}
            <div className="space-y-2 text-xs">
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
                <span>Estimated Sales Tax</span>
                <span className="font-serif">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-cream-muted">
                <span>Premium Courier Shipping</span>
                <span className="font-serif">
                  {shippingAmount === 0 ? "Complimentary" : `$${shippingAmount.toFixed(2)}`}
                </span>
              </div>
              
              <div className="h-px bg-gold-subtle/20 my-4" />
              
              <div className="flex justify-between text-cream font-medium">
                <span className="text-sm tracking-wide font-serif">Grand Total</span>
                <span className="text-base text-gold font-serif font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Success screen with mock email details */
        <div className="max-w-2xl mx-auto space-y-12 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-gold mx-auto mb-6">
              <CheckIcon size={32} />
            </div>
            <h2 className="font-serif text-3xl font-light text-cream tracking-wide">
              Authorization Successful
            </h2>
            <p className="text-sm text-cream-muted max-w-md mx-auto leading-relaxed">
              Your order has been registered in our central cache. Order ID:{" "}
              <span className="text-gold font-semibold font-mono">{placedOrderId}</span>
            </p>
          </div>

          {/* Simulated Email Box */}
          <div className="bg-forest/15 border border-gold-subtle/20 rounded shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gold-subtle/10 pb-4">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gold block font-semibold">
                  MOCK NOTIFICATION OUTBOX
                </span>
                <span className="text-xs text-cream font-mono">From: communications@antigravity.com</span>
              </div>
              <span className="text-[10px] text-cream-muted/70 font-mono">Estimated delivery: 2-3 Days</span>
            </div>

            <div className="space-y-4 text-xs font-light leading-relaxed">
              <p>Dear {fullName},</p>
              
              <p>
                We have registered your order <span className="text-gold font-semibold">{placedOrderId}</span>. Your literary assets are being hand-packed inside our weather-sealed linen sheets at our Pacific Northwest outpost.
              </p>

              <div className="bg-midnight/70 p-4 border border-gold-subtle/5 space-y-2 rounded">
                <h4 className="font-serif text-gold text-xs font-semibold mb-2">Order Allocation</h4>
                <div className="text-[11px] space-y-1.5 font-mono">
                  <div>Delivery Address: {address}, {city}, {state} {zip}, {country}</div>
                  <div>Estimated Courier Shipment: Priority Courier Tracked</div>
                </div>
              </div>

              <p>
                A courier tracking notification will be triggered within 12 hours. If you wish to make changes, please access the portal immediately.
              </p>

              <p className="pt-4 text-gold/80 italic">
                Warm regards,<br />
                The Antigravity Library Outpost
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link
              href="/products"
              className="px-8 py-3 bg-gold text-midnight hover:bg-gold-light border border-gold font-serif text-sm font-semibold tracking-widest uppercase transition-luxury"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
