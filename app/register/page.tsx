"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

function RegisterForm() {
  const { register, user } = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const nextUrl      = searchParams.get("next") || "/";

  const [name,     setName]    = useState("");
  const [email,    setEmail]   = useState("");
  const [password, setPw]      = useState("");
  const [confirm,  setConfirm] = useState("");
  const [showPw,   setShowPw]  = useState(false);
  const [loading,  setLoading] = useState(false);

  useEffect(() => { if (user) router.replace(nextUrl); }, [user, router, nextUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.ok) { toast.success("Account created! Welcome 🎉"); router.replace(nextUrl); }
    else toast.error(result.error || "Registration failed");
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"];
  const strengthLabel = ["", "Weak", "Good", "Strong"];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-shopbg">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-navbg to-primary text-white p-10 w-2/5">
          <div className="mb-6">
            <span className="text-3xl font-bold">Shop</span>
            <span className="text-3xl font-bold text-accent">Sphere</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 leading-snug">Join millions of happy shoppers</h2>
          <p className="text-teal-200 text-sm leading-relaxed mb-6">
            Create your free account and enjoy exclusive deals, fast delivery and hassle-free returns.
          </p>
          <ul className="space-y-2 text-sm text-teal-100">
            {["Track your orders easily","Exclusive member discounts","Early access to sales","24/7 customer support"].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-accent flex-shrink-0" /> {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
          <p className="text-sm text-gray-500 mb-6">
            Already have an account?{" "}
            <Link href={`/login${nextUrl !== "/" ? `?next=${nextUrl}` : ""}`}
              className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your full name" className="input-field" />
            </div>
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
                  placeholder="Min. 6 characters" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{strengthLabel[strength]}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                className={`input-field ${confirm && confirm !== password ? "border-red-400 focus:border-red-400" : ""}`} />
              {confirm && confirm !== password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base">
              {loading
                ? <span className="flex items-center gap-2"><span className="spinner" /> Creating account…</span>
                : <span className="flex items-center gap-2"><UserPlus size={16} /> Create Account</span>}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            By registering, you agree to ShopSphere&apos;s{" "}
            <a href="#" className="underline">Terms of Use</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
