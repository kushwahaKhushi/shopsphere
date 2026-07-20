"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart, Search, User, Menu, X, Package,
  ChevronDown, Shield, LogOut, LogIn, UserPlus,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const categories = [
  { label: "Electronics",     href: "/products?category=Electronics" },
  { label: "Fashion",         href: "/products?category=Fashion" },
  { label: "Home & Kitchen",  href: "/products?category=Home+%26+Kitchen" },
  { label: "Sports & Outdoors", href: "/products?category=Sports+%26+Outdoors" },
];

export default function Navbar() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [query, setQuery]           = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/products?search=${encodeURIComponent(query.trim())}`); setMobileOpen(false); }
  };

  const handleLogout = () => {
    logout(); setUserMenu(false); setMobileOpen(false);
    toast.success("Logged out"); router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* ── Main bar (navbg = teal-900) ─────────────────── */}
      <div className="bg-navbg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">Shop</span>
              <span className="text-2xl font-bold text-accent tracking-tight">Sphere</span>
              <p className="text-[10px] text-teal-300 italic -mt-0.5 hidden sm:block">Explore. Buy. Smile.</p>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch}
            className="flex-1 max-w-2xl hidden sm:flex items-center bg-white rounded-md overflow-hidden shadow-sm">
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands and more…"
              className="flex-1 px-4 py-2.5 text-sm text-gray-700 outline-none"
            />
            <button type="submit"
              className="bg-accent hover:bg-accent-dark px-5 py-2.5 text-white transition-colors">
              <Search size={18} />
            </button>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">

            {/* User dropdown */}
            <div className="relative hidden sm:block" ref={menuRef}>
              <button onClick={() => setUserMenu(v => !v)}
                className="flex items-center gap-1.5 text-white hover:text-accent transition-colors px-2 py-1.5 rounded">
                <User size={18} />
                <span className="text-sm font-medium max-w-[90px] truncate">
                  {user ? user.name.split(" ")[0] : "Login"}
                </span>
                <ChevronDown size={13} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b bg-primary-50 rounded-t-xl">
                        <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="text-[10px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded mt-1 inline-block">ADMIN</span>
                        )}
                      </div>
                      <Link href="/orders" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Package size={14} className="text-primary" /> My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Shield size={14} className="text-primary" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t mt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <LogIn size={14} className="text-primary" /> Sign In
                      </Link>
                      <Link href="/register" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <UserPlus size={14} className="text-primary" /> Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Admin shortcut — only show if admin */}
            {user?.role === "admin" && (
              <Link href="/admin"
                className="hidden sm:flex items-center gap-1.5 text-white hover:text-accent transition-colors px-2 py-1.5 rounded text-sm font-medium">
                <Shield size={17} /> Admin
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart"
              className="flex items-center gap-1.5 text-white hover:text-accent transition-colors px-2 py-1.5 rounded">
              <div className="relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium hidden sm:block">Cart</span>
            </Link>

            {/* Mobile hamburger */}
            <button className="sm:hidden text-white p-1"
              onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Category strip (primary = teal-700) ────────── */}
      <div className="bg-primary hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto">
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href}
              className="text-white/90 hover:text-white text-sm py-2 whitespace-nowrap transition-colors font-medium flex items-center gap-0.5">
              {cat.label} <ChevronDown size={13} />
            </Link>
          ))}
          <Link href="/products"
            className="text-teal-200 hover:text-white text-sm py-2 whitespace-nowrap transition-colors ml-auto">
            All Products →
          </Link>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────── */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-b shadow-xl">
          <form onSubmit={handleSearch} className="flex items-center border-b px-4 py-2 gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…" className="flex-1 text-sm outline-none py-1.5" />
            <button type="submit" className="text-primary"><Search size={18} /></button>
          </form>
          <nav className="flex flex-col divide-y text-sm text-gray-700">
            {categories.map((cat) => (
              <Link key={cat.label} href={cat.href}
                className="px-4 py-3 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                {cat.label}
              </Link>
            ))}
            <Link href="/orders" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <Package size={16} className="text-primary" /> My Orders
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Shield size={16} className="text-primary" /> Admin Panel
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout}
                className="px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-red-600 text-left w-full">
                <LogOut size={16} /> Sign Out ({user.name})
              </button>
            ) : (
              <>
                <Link href="/login" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <LogIn size={16} className="text-primary" /> Sign In
                </Link>
                <Link href="/register" className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
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
