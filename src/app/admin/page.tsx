"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getMockOrders, getSalesMetrics, SimulatedOrder } from "@/data/mockOrders";
import { getMockProducts } from "@/data/mockProducts";
import { Product } from "@/context/CartContext";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<SimulatedOrder[]>([]);
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalOrders: 0, averageValue: 0 });
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchedOrders = getMockOrders();
    setOrders([...fetchedOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    setMetrics(getSalesMetrics());

    const allProducts = getMockProducts();
    const lowStock = allProducts.filter((p) => p.stock <= 5);
    setLowStockProducts(lowStock);
  }, []);

  return (
    <div className="space-y-10 font-sans animate-fade-in">
      {/* Header section */}
      <div>
        <span className="text-[10px] font-bold text-gold tracking-widest uppercase block">
          Operational Summary
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-cream font-light tracking-wide mt-1">
          Metrics Dashboard
        </h1>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-midnight border border-gold-subtle/15 p-5 rounded space-y-2">
          <span className="text-[9px] font-bold text-cream-muted tracking-widest uppercase block">
            Total Revenue
          </span>
          <p className="font-serif text-2xl text-gold font-semibold">
            ${metrics.totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-midnight border border-gold-subtle/15 p-5 rounded space-y-2">
          <span className="text-[9px] font-bold text-cream-muted tracking-widest uppercase block">
            Total Orders
          </span>
          <p className="font-serif text-2xl text-gold font-semibold">
            {metrics.totalOrders}
          </p>
        </div>

        <div className="bg-midnight border border-gold-subtle/15 p-5 rounded space-y-2">
          <span className="text-[9px] font-bold text-cream-muted tracking-widest uppercase block">
            Average Cart Value
          </span>
          <p className="font-serif text-2xl text-gold font-semibold">
            ${metrics.averageValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Operations Row (Low Stock + Order History) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Low Stock Alerts */}
        <div className="xl:col-span-1 bg-midnight border border-gold-subtle/10 rounded p-5 space-y-4">
          <h2 className="font-serif text-base text-cream font-light tracking-wide border-b border-gold-subtle/10 pb-2">
            Low Stock Alerts
          </h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-cream-muted font-light">All stock counts are stable.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex justify-between items-center text-xs border-b border-gold-subtle/5 pb-2 last:border-b-0">
                  <div className="min-w-0 pr-4">
                    <h4 className="text-cream font-light truncate">{p.name}</h4>
                    <p className="text-[9px] text-cream-muted/70">{p.author}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                    p.stock === 0
                      ? "bg-red-500/20 text-red-400 border border-red-400/30"
                      : "bg-gold/15 text-gold border border-gold/25"
                  }`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="xl:col-span-2 bg-midnight border border-gold-subtle/10 rounded p-5 space-y-4">
          <h2 className="font-serif text-base text-cream font-light tracking-wide border-b border-gold-subtle/10 pb-2">
            Recent Order Registrations
          </h2>
          
          {orders.length === 0 ? (
            <p className="text-xs text-cream-muted font-light">No orders recorded in cache yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gold-subtle/10 text-gold uppercase tracking-wider text-[9px] font-bold">
                    <th className="py-2.5">ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Items</th>
                    <th className="py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-subtle/5 text-cream-muted font-light">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-forest/5 transition-luxury">
                      <td className="py-3 font-mono font-semibold text-gold">{o.id}</td>
                      <td className="py-3 text-cream">{o.shipping_details.fullName}</td>
                      <td className="py-3">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="py-3 truncate max-w-[150px]" title={o.items.map(i => `${i.product_name} (${i.quantity})`).join(", ")}>
                        {o.items.map(i => i.product_name).join(", ")}
                      </td>
                      <td className="py-3 text-right text-cream font-medium font-serif">${o.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
