"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

function LoginForm() {
  const { login, user } = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const nextUrl      = searchParams.get("next") || "/";

  const [email,   setEmail]   = useState("");
  const [password, setPw]     = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) router.replace(nextUrl); }, [user, router, nextUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) { toast.success("Welcome back! 👋"); router.replace(nextUrl); }
    else toast.error(result.error || "Login failed");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-shopbg">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-navbg to-primary text-white p-10 w-2/5">
          <div className="mb-6">
            <span className="text-3xl font-bold">Shop</span>
            <span className="text-3xl font-bold text-accent">Sphere</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 leading-snug">Login &amp; access your world of shopping</h2>
          <p className="text-teal-200 text-sm leading-relaxed">
            Get access to your Orders, Wishlist and Recommendations.
          </p>
          <div className="mt-8 flex items-center gap-2 text-teal-300 text-sm">
            <ShoppingBag size={16} />
            <span>Over 10,000 happy customers</span>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Sign In</h1>
          <p className="text-sm text-gray-500 mb-6">
            Don&apos;t have an account?{" "}
            <Link href={`/register${nextUrl !== "/" ? `?next=${nextUrl}` : ""}`}
              className="text-primary font-semibold hover:underline">Create one</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={password}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Enter your password" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 text-xs text-teal-700">
              <strong>Demo credentials:</strong><br />
              User: demo@shopsphere.in / demo1234<br />
              Admin: admin@shopsphere.in / admin1234
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base">
              {loading
                ? <span className="flex items-center gap-2"><span className="spinner" /> Signing in…</span>
                : <span className="flex items-center gap-2"><LogIn size={16} /> Sign In</span>}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            By continuing, you agree to ShopSphere&apos;s{" "}
            <a href="#" className="underline">Terms of Use</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
