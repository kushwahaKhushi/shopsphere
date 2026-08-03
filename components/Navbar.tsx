"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart, Search, User, Menu, X, Package,
  ChevronDown, Shield, LogOut, LogIn, UserPlus,
  Heart, Bell,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast       from "react-hot-toast";

const CATS = [
  { label: "Electronics",      href: "/products?category=Electronics" },
  { label: "Fashion",          href: "/products?category=Fashion" },
  { label: "Home & Kitchen",   href: "/products?category=Home+%26+Kitchen" },
  { label: "Sports & Outdoors",href: "/products?category=Sports+%26+Outdoors" },
];

export default function Navbar() {
  const router = useRouter();
  const { cartCount }   = useCart();
  const { user, logout }= useAuth();

  const [query,   setQuery]   = useState("");
  const [mobile,  setMobile]  = useState(false);
  const [userOpen,setUOpen]   = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setMobile(false);
  };

  const handleLogout = () => {
    logout(); setUOpen(false); setMobile(false);
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">

      {/* ── Top bar ─────────────────────────────────── */}
      <div className="bg-navbg">
        <div className="max-w-7xl mx-auto px-4 h-[64px] flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-amber-400
                            flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg leading-none">S</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="text-xl font-black text-white">Shop</span>
              <span className="text-xl font-black text-accent">Sphere</span>
              <p className="text-[10px] text-teal-300/80 italic -mt-0.5">Explore. Buy. Smile.</p>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch}
            className="flex-1 max-w-2xl hidden sm:flex items-center
                       bg-white/10 hover:bg-white/15 focus-within:bg-white
                       rounded-xl overflow-hidden border border-white/10
                       focus-within:border-accent transition-all group">
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands and more…"
              className="flex-1 px-4 py-2.5 text-sm bg-transparent text-white
                         group-[.focus-within]:text-gray-800 placeholder-white/50
                         group-focus-within:placeholder-gray-400 outline-none
                         focus:text-gray-800"
            />
            <button type="submit"
              className="bg-accent hover:bg-accent-dark px-5 py-2.5 text-white
                         transition-colors flex-shrink-0">
              <Search size={17} />
            </button>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1">

            {/* Notification — desktop */}
            <button className="relative hidden sm:flex btn-icon border-white/10 bg-white/10
                               text-white hover:bg-white hover:text-gray-800 w-10 h-10">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full
                               border border-navbg animate-pulse-dot" />
            </button>

            {/* Wishlist — desktop */}
            <button className="hidden sm:flex btn-icon border-white/10 bg-white/10
                               text-white hover:bg-white hover:text-gray-800 w-10 h-10">
              <Heart size={17} />
            </button>

            {/* User dropdown */}
            <div className="relative hidden sm:block" ref={menuRef}>
              <button onClick={() => setUOpen((v) => !v)}
                className="flex items-center gap-2 text-white hover:text-accent
                           transition-colors px-2 py-1.5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark
                                flex items-center justify-center border-2 border-teal-400/50">
                  {user
                    ? <span className="text-white font-black text-sm">{user.name[0].toUpperCase()}</span>
                    : <User size={15} className="text-white" />
                  }
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[10px] text-teal-300/80 leading-none">
                    {user ? "Account" : "Guest"}
                  </p>
                  <p className="text-[13px] font-bold text-white leading-tight max-w-[90px] truncate">
                    {user ? user.name.split(" ")[0] : "Login"}
                  </p>
                </div>
                <ChevronDown size={13} className="text-teal-300/60 hidden md:block" />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl
                                shadow-card-lg border border-gray-100 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b bg-primary-50 rounded-t-2xl">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark
                                        flex items-center justify-center mb-2">
                          <span className="text-white font-black text-lg">{user.name[0].toUpperCase()}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="mt-1.5 inline-block text-[10px] font-black text-primary
                                           bg-primary-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Admin
                          </span>
                        )}
                      </div>
                      <Link href="/orders" onClick={() => setUOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                                   hover:bg-gray-50 transition-colors">
                        <Package size={15} className="text-primary" /> My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={() => setUOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                                     hover:bg-gray-50 transition-colors">
                          <Shield size={15} className="text-primary" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm
                                     text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-bold text-gray-800">Welcome!</p>
                        <p className="text-xs text-gray-400">Sign in for a better experience</p>
                      </div>
                      <Link href="/login" onClick={() => setUOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                                   hover:bg-gray-50 transition-colors">
                        <LogIn size={15} className="text-primary" /> Sign In
                      </Link>
                      <Link href="/register" onClick={() => setUOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                                   hover:bg-gray-50 transition-colors">
                        <UserPlus size={15} className="text-primary" /> Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Admin shortcut */}
            {user?.role === "admin" && (
              <Link href="/admin"
                className="hidden sm:flex items-center gap-1.5 text-white hover:text-accent
                           px-2 py-1.5 rounded-xl transition-colors text-sm font-semibold">
                <Shield size={16} /> Admin
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart"
              className="relative flex items-center gap-1.5 text-white hover:text-accent
                         px-2 py-1.5 rounded-xl transition-colors group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10
                                flex items-center justify-center transition-colors group-hover:bg-accent/90">
                  <ShoppingCart size={19} />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px]
                                   font-black rounded-full min-w-[19px] h-[19px]
                                   flex items-center justify-center px-0.5 shadow-sm border-2 border-navbg">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold hidden sm:block">Cart</span>
            </Link>

            {/* Mobile toggle */}
            <button onClick={() => setMobile((v) => !v)}
              className="sm:hidden w-10 h-10 rounded-xl bg-white/10 border border-white/10
                         text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Menu">
              {mobile ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category strip ───────────────────────────── */}
      <div className="bg-primary hidden sm:block border-t border-primary-dark/30">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
          {CATS.map((c) => (
            <Link key={c.label} href={c.href}
              className="text-white/80 hover:text-white text-sm py-2.5 px-3 whitespace-nowrap
                         font-medium flex items-center gap-0.5 rounded-lg
                         hover:bg-white/10 transition-all duration-150 group">
              {c.label}
              <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-200" />
            </Link>
          ))}
          <Link href="/products"
            className="ml-auto text-teal-200 hover:text-white text-sm py-2.5 px-3
                       whitespace-nowrap font-semibold transition-colors">
            All Products →
          </Link>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────── */}
      {mobile && (
        <div className="sm:hidden bg-white border-b shadow-xl">
          <form onSubmit={handleSearch} className="flex items-center border-b px-4 py-3 gap-2">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="flex-1 text-sm outline-none py-1 text-gray-800 placeholder-gray-400" />
            <button type="submit" className="text-primary font-semibold text-sm">Go</button>
          </form>
          <nav className="flex flex-col divide-y text-sm text-gray-700">
            {CATS.map((c) => (
              <Link key={c.label} href={c.href}
                className="px-5 py-3.5 hover:bg-gray-50 font-medium" onClick={() => setMobile(false)}>
                {c.label}
              </Link>
            ))}
            <Link href="/orders" onClick={() => setMobile(false)}
              className="px-5 py-3.5 hover:bg-gray-50 flex items-center gap-2.5">
              <Package size={16} className="text-primary" /> My Orders
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" onClick={() => setMobile(false)}
                className="px-5 py-3.5 hover:bg-gray-50 flex items-center gap-2.5">
                <Shield size={16} className="text-primary" /> Admin Panel
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout}
                className="px-5 py-3.5 hover:bg-red-50 text-red-600 flex items-center gap-2.5 text-left w-full">
                <LogOut size={16} /> Sign Out ({user.name})
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobile(false)}
                  className="px-5 py-3.5 hover:bg-gray-50 flex items-center gap-2.5">
                  <LogIn size={16} className="text-primary" /> Sign In
                </Link>
                <Link href="/register" onClick={() => setMobile(false)}
                  className="px-5 py-3.5 hover:bg-gray-50 flex items-center gap-2.5">
                  <UserPlus size={16} className="text-primary" /> Create Account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
