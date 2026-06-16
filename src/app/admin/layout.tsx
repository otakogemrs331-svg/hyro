"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DashboardIcon, TagIcon, EditIcon, BookOpenIcon } from "@/components/icons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Read local storage check to keep session active during testing
    const authSession = localStorage.getItem("antigravity_admin_auth");
    if (authSession === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === "admin") {
      setIsAuthenticated(true);
      setError("");
      localStorage.setItem("antigravity_admin_auth", "true");
    } else {
      setError("Invalid administrative passcode. Enter 'admin'.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("antigravity_admin_auth");
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-sans px-4">
        <div className="w-full max-w-md bg-forest/10 border border-gold-subtle/20 p-8 shadow-2xl space-y-6 rounded">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-gold tracking-widest uppercase block">
              Security Gate
            </span>
            <h1 className="font-serif text-2xl text-cream font-light tracking-wide">
              Portal Access
            </h1>
            <p className="text-xs text-cream-muted leading-relaxed font-light">
              This area is restricted to administrators. Enter passcode <code className="text-gold font-semibold font-mono">admin</code> to authorize.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-[9px] tracking-wider uppercase text-cream-muted">Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••"
                className="w-full bg-midnight border border-gold-subtle/30 rounded px-3 py-2 text-center text-sm text-cream focus:outline-none focus:border-gold transition-luxury font-mono tracking-widest"
                required
              />
            </div>
            
            {error && <p className="text-xs text-red-400 text-center font-sans">{error}</p>}
            
            <button
              type="submit"
              className="w-full py-2.5 bg-gold text-midnight hover:bg-gold-light border border-gold text-xs font-semibold tracking-widest uppercase transition-luxury cursor-pointer"
            >
              Authorize Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: <DashboardIcon size={18} /> },
    { href: "/admin/products", label: "Inventory", icon: <EditIcon size={18} /> },
    { href: "/admin/discounts", label: "Discounts", icon: <TagIcon size={18} /> },
    { href: "/admin/blog", label: "Blog CMS", icon: <BookOpenIcon size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <aside className="bg-forest/10 border border-gold-subtle/10 p-6 rounded space-y-8 lg:sticky lg:top-24">
          <div className="border-b border-gold-subtle/10 pb-4">
            <span className="text-[10px] font-bold text-gold tracking-widest uppercase block mb-1">
              Admin Portal
            </span>
            <h2 className="font-serif text-lg text-cream font-light tracking-wide">
              Control Panel
            </h2>
          </div>

          <nav className="flex flex-col space-y-2 text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 py-2.5 px-3 rounded transition-luxury ${
                    isActive
                      ? "bg-sage text-cream border border-gold/30 font-semibold"
                      : "text-cream-muted hover:text-gold hover:bg-forest/40"
                  }`}
                >
                  {link.icon}
                  <span className="tracking-wider uppercase">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-gold-subtle/10">
            <button
              onClick={handleLogout}
              className="w-full py-2 border border-red-400/30 text-red-400 hover:bg-red-400/10 rounded text-xs font-semibold tracking-wider uppercase transition-luxury cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="lg:col-span-3 bg-forest/5 border border-gold-subtle/5 p-6 sm:p-8 rounded min-h-[60vh] flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
