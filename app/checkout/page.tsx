"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin, CreditCard, Smartphone, Banknote,
  CheckCircle2, ChevronRight, LogIn, QrCode, Copy, Loader2,
} from "lucide-react";
import { useCart }   from "@/context/CartContext";
import { useAuth }   from "@/context/AuthContext";
import Breadcrumb    from "@/components/Breadcrumb";
import toast         from "react-hot-toast";

/* ── Types ──────────────────────────────────────────────── */
type Step = "address" | "payment" | "review";

/* ── Constants ──────────────────────────────────────────── */
const UPI_ID = "shopsphere@upi";

const UPI_QR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="white"/>
  <rect x="10" y="10" width="56" height="56" rx="4" fill="%230f766e"/>
  <rect x="17" y="17" width="42" height="42" rx="2" fill="white"/>
  <rect x="24" y="24" width="28" height="28" rx="1" fill="%230f766e"/>
  <rect x="134" y="10" width="56" height="56" rx="4" fill="%230f766e"/>
  <rect x="141" y="17" width="42" height="42" rx="2" fill="white"/>
  <rect x="148" y="24" width="28" height="28" rx="1" fill="%230f766e"/>
  <rect x="10" y="134" width="56" height="56" rx="4" fill="%230f766e"/>
  <rect x="17" y="141" width="42" height="42" rx="2" fill="white"/>
  <rect x="24" y="148" width="28" height="28" rx="1" fill="%230f766e"/>
  <rect x="80" y="14" width="8" height="8" fill="%230f766e"/>
  <rect x="96" y="14" width="8" height="8" fill="%230f766e"/>
  <rect x="112" y="14" width="8" height="8" fill="%230f766e"/>
  <rect x="80" y="30" width="8" height="8" fill="%230f766e"/>
  <rect x="96" y="46" width="8" height="8" fill="%230f766e"/>
  <rect x="112" y="62" width="8" height="8" fill="%230f766e"/>
  <rect x="14" y="80" width="8" height="8" fill="%230f766e"/>
  <rect x="46" y="80" width="8" height="8" fill="%230f766e"/>
  <rect x="80" y="80" width="8" height="8" fill="%230f766e"/>
  <rect x="128" y="80" width="8" height="8" fill="%230f766e"/>
  <rect x="160" y="80" width="8" height="8" fill="%230f766e"/>
  <rect x="14" y="96" width="8" height="8" fill="%230f766e"/>
  <rect x="80" y="96" width="8" height="8" fill="%230f766e"/>
  <rect x="112" y="96" width="8" height="8" fill="%230f766e"/>
  <rect x="160" y="96" width="8" height="8" fill="%230f766e"/>
  <rect x="30" y="112" width="8" height="8" fill="%230f766e"/>
  <rect x="96" y="112" width="8" height="8" fill="%230f766e"/>
  <rect x="144" y="112" width="8" height="8" fill="%230f766e"/>
  <rect x="80" y="128" width="8" height="8" fill="%230f766e"/>
  <rect x="128" y="128" width="8" height="8" fill="%230f766e"/>
  <rect x="80" y="144" width="8" height="8" fill="%230f766e"/>
  <rect x="112" y="160" width="8" height="8" fill="%230f766e"/>
  <rect x="160" y="176" width="8" height="8" fill="%230f766e"/>
</svg>`;

const METHODS = [
  { id: "UPI",              label: "UPI",                icon: Smartphone, sub: "Google Pay, PhonePe, Paytm" },
  { id: "Credit Card",      label: "Credit / Debit Card", icon: CreditCard, sub: "Visa, Mastercard, RuPay"  },
  { id: "NetBanking",       label: "Net Banking",         icon: Banknote,   sub: "All major banks"           },
  { id: "Cash on Delivery", label: "Cash on Delivery",    icon: Banknote,   sub: "Pay when delivered"        },
];

const STATES = [
  "Andhra Pradesh","Delhi","Gujarat","Karnataka","Kerala",
  "Maharashtra","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal",
];

const STEPS: { key: Step; label: string }[] = [
  { key: "address", label: "Delivery Address" },
  { key: "payment", label: "Payment"           },
  { key: "review",  label: "Review Order"      },
];

/* ═══════════════════════════════════════════════════════════
   CheckoutPage — ALL hooks declared unconditionally at top
═══════════════════════════════════════════════════════════ */
export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isLoading }                  = useAuth();
  const router                               = useRouter();

  /* ── All state hooks first, unconditionally ── */
  const [step,    setStep]    = useState<Step>("address");
  const [placing, setPlacing] = useState(false);
  const [method,  setMethod]  = useState("UPI");
  const [copied,  setCopied]  = useState(false);
  const [address, setAddress] = useState({
    name: "", phone: "", addressLine: "", city: "", state: "", pincode: "",
  });

  /* ── All effect hooks next, unconditionally ── */

  /* Pre-fill name when user becomes available */
  useEffect(() => {
    if (user?.name) setAddress(a => ({ ...a, name: a.name || user.name }));
  }, [user]);

  /* Redirect to cart when cart empties (only if logged in) */
  useEffect(() => {
    if (!isLoading && user && cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [isLoading, user, cartItems.length, router]);

  /* ── Derived values ── */
  const savings    = cartItems.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0);
  const delivery   = cartTotal >= 499 ? 0 : 40;
  const finalTotal = cartTotal + delivery;
  const stepIdx    = STEPS.findIndex(s => s.key === step);

  /* ── Guard renders (after all hooks) ── */
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-primary-light">
            <LogIn size={30} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Login to Continue</h2>
          <p className="text-gray-500 text-sm mb-6">
            You need to be signed in to place an order. Your cart items are saved.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login?next=/checkout" className="btn-primary justify-center py-3 text-base font-bold">
              <LogIn size={16} /> Sign In
            </Link>
            <Link href="/register?next=/checkout" className="btn-outline justify-center py-3">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) return null;   /* redirect effect fires; show nothing */

  /* ── Handlers ── */
  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const next = () => {
    const idx = STEPS.findIndex(s => s.key === step);
    if (idx < STEPS.length - 1) { setStep(STEPS[idx + 1].key); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const back = () => {
    const idx = STEPS.findIndex(s => s.key === step);
    if (idx > 0) { setStep(STEPS[idx - 1].key); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems.map(i => ({
            productId: i.product.id,
            name:      i.product.name,
            price:     i.product.price,
            quantity:  i.quantity,
            image:     i.product.images[0],
          })),
          total:         finalTotal,
          address,
          paymentMethod: method,
        }),
      });
      if (!res.ok) throw new Error("order failed");
      const { order } = await res.json();
      clearCart();
      toast.success("Order placed successfully! 🎉", { duration: 4000 });
      router.push(`/order-success?id=${order.id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  /* ═══════════════════════════════════════════════════════
     Render
  ═══════════════════════════════════════════════════════ */
  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
      <div className="mb-4">
        <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      </div>

      {/* Step indicator */}
      <div className="bg-navbg rounded-xl px-6 py-4 mb-5 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${i <= stepIdx ? "text-white" : "text-teal-500"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i < stepIdx  ? "bg-accent border-accent text-white" :
                i === stepIdx ? "bg-white text-primary border-white" :
                "border-teal-600 text-teal-500"
              }`}>
                {i < stepIdx ? "✓" : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={15} className="text-teal-600" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Main form ────────────────────────────────── */}
        <div className="lg:col-span-2">

          {/* STEP 1 — Address */}
          {step === "address" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Delivery Address
              </h2>
              <form onSubmit={e => { e.preventDefault(); next(); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                    <input required value={address.name}
                      onChange={e => setAddress({ ...address, name: e.target.value })}
                      placeholder="Your full name" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                    <input required pattern="[0-9]{10}" value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })}
                      placeholder="10-digit mobile number" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Address *</label>
                  <textarea required rows={2} value={address.addressLine}
                    onChange={e => setAddress({ ...address, addressLine: e.target.value })}
                    placeholder="House No., Street, Area, Landmark" className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                    <input required value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      placeholder="City" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                    <select required value={address.state}
                      onChange={e => setAddress({ ...address, state: e.target.value })}
                      className="input-field">
                      <option value="">Select State</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode *</label>
                    <input required pattern="[0-9]{6}" value={address.pincode}
                      onChange={e => setAddress({ ...address, pincode: e.target.value })}
                      placeholder="6-digit pincode" className="input-field" />
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary justify-center py-3 text-sm font-bold mt-1">
                  Continue to Payment <ChevronRight size={15} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === "payment" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" /> Payment Method
              </h2>

              <div className="space-y-3 mb-5">
                {METHODS.map(({ id, label, icon: Icon, sub }) => (
                  <label key={id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      method === id ? "border-primary bg-primary-50 shadow-sm" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <input type="radio" name="payment" value={id}
                      checked={method === id} onChange={() => setMethod(id)} className="accent-primary" />
                    <Icon size={20} className={method === id ? "text-primary" : "text-gray-400"} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* UPI QR Panel */}
              {method === "UPI" && (
                <div className="border-2 border-primary/30 rounded-xl p-5 bg-primary-50 mb-5">
                  <div className="flex items-center gap-2 mb-4">
                    <QrCode size={17} className="text-primary" />
                    <h3 className="font-bold text-primary text-sm">Scan &amp; Pay via UPI</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* QR */}
                    <div className="flex-shrink-0">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={UPI_QR} alt="UPI QR Code" className="w-40 h-40" />
                      </div>
                      <p className="text-[11px] text-gray-400 text-center mt-1.5">Scan with any UPI app</p>
                    </div>
                    {/* Details */}
                    <div className="flex-1 space-y-3 text-sm w-full">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-semibold">Pay to UPI ID</p>
                        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2.5">
                          <span className="flex-1 font-mono text-gray-800">{UPI_ID}</span>
                          <button onClick={copyUpi}
                            className="text-primary hover:text-primary-dark font-medium text-xs flex items-center gap-1 transition-colors">
                            <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-semibold">Amount to Pay</p>
                        <p className="text-2xl font-black text-primary">₹{finalTotal.toLocaleString()}</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                        <strong>Demo mode:</strong> This is a dummy QR for demonstration. Click &quot;Review Order&quot; to proceed.
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Google Pay", "PhonePe", "Paytm", "BHIM"].map(app => (
                          <span key={app}
                            className="bg-white border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={back} className="btn-outline flex-1 justify-center py-3">← Back</button>
                <button onClick={next} className="btn-primary flex-1 justify-center py-3 font-bold">
                  Review Order <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === "review" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-primary" /> Review Your Order
              </h2>

              {/* Address recap */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm border border-gray-100">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700 flex items-center gap-1">
                    <MapPin size={13} /> Delivery Address
                  </span>
                  <button onClick={() => setStep("address")} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <p className="font-semibold text-gray-800">{address.name} · {address.phone}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {address.addressLine}, {address.city}, {address.state} – {address.pincode}
                </p>
              </div>

              {/* Payment recap */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm border border-gray-100">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700 flex items-center gap-1">
                    <CreditCard size={13} /> Payment
                  </span>
                  <button onClick={() => setStep("payment")} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <p className="text-gray-600">{method}</p>
                {method === "UPI" && <p className="text-xs text-gray-400 mt-0.5">UPI ID: {UPI_ID}</p>}
              </div>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 text-sm">
                    <div className="relative w-14 h-14 bg-gray-50 rounded-lg border flex-shrink-0 overflow-hidden">
                      <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900 flex-shrink-0">
                      ₹{(product.price * quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={back} className="btn-outline flex-1 justify-center py-3">← Back</button>
                <button onClick={placeOrder} disabled={placing} className="btn-accent flex-1 justify-center py-3 font-bold text-base">
                  {placing
                    ? <span className="flex items-center gap-2"><span className="spinner" /> Placing…</span>
                    : <>Place Order · ₹{finalTotal.toLocaleString()}</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Summary sidebar ─────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-5 h-fit sticky top-20">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b">
            Price Details
          </h3>
          <div className="space-y-2.5 text-sm mb-4">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-gray-600 gap-2">
                <span className="truncate">{product.name} ×{quantity}</span>
                <span className="font-medium flex-shrink-0">₹{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Savings</span><span>− ₹{savings.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>{delivery === 0
                ? <span className="text-green-600 font-semibold">FREE</span>
                : `₹${delivery}`}
              </span>
            </div>
          </div>
          <div className="border-t border-dashed mt-3 pt-3 flex justify-between font-black text-gray-900 text-base">
            <span>Total</span><span>₹{finalTotal.toLocaleString()}</span>
          </div>
          {savings > 0 && (
            <p className="text-xs text-green-600 font-medium mt-3 bg-green-50 rounded-lg px-3 py-2 text-center">
              🎉 You save ₹{savings.toLocaleString()} on this order!
            </p>
          )}
          <p className="text-[11px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
            🔒 Safe &amp; Secure Payments
          </p>
        </div>
      </div>
    </div>
  );
}
