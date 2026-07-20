"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin, CreditCard, Smartphone, Banknote,
  CheckCircle2, ChevronRight, LogIn, QrCode, Copy,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Breadcrumb from "@/components/Breadcrumb";
import toast from "react-hot-toast";

type Step = "address" | "payment" | "review";

const UPI_ID = "shopsphere@upi";
// Inline SVG QR-code pattern (dummy visual — real apps would use a QR library)
const UPI_QR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="white"/>
  <!-- finder pattern TL -->
  <rect x="10" y="10" width="56" height="56" rx="4" fill="%230f766e"/>
  <rect x="17" y="17" width="42" height="42" rx="2" fill="white"/>
  <rect x="24" y="24" width="28" height="28" rx="1" fill="%230f766e"/>
  <!-- finder pattern TR -->
  <rect x="134" y="10" width="56" height="56" rx="4" fill="%230f766e"/>
  <rect x="141" y="17" width="42" height="42" rx="2" fill="white"/>
  <rect x="148" y="24" width="28" height="28" rx="1" fill="%230f766e"/>
  <!-- finder pattern BL -->
  <rect x="10" y="134" width="56" height="56" rx="4" fill="%230f766e"/>
  <rect x="17" y="141" width="42" height="42" rx="2" fill="white"/>
  <rect x="24" y="148" width="28" height="28" rx="1" fill="%230f766e"/>
  <!-- data dots (random pattern for visual) -->
  <rect x="80"  y="14"  width="8" height="8" fill="%230f766e"/>
  <rect x="96"  y="14"  width="8" height="8" fill="%230f766e"/>
  <rect x="112" y="14"  width="8" height="8" fill="%230f766e"/>
  <rect x="80"  y="30"  width="8" height="8" fill="%230f766e"/>
  <rect x="112" y="30"  width="8" height="8" fill="%230f766e"/>
  <rect x="96"  y="46"  width="8" height="8" fill="%230f766e"/>
  <rect x="80"  y="62"  width="8" height="8" fill="%230f766e"/>
  <rect x="96"  y="62"  width="8" height="8" fill="%230f766e"/>
  <rect x="14"  y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="30"  y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="46"  y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="62"  y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="80"  y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="96"  y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="128" y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="144" y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="160" y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="176" y="80"  width="8" height="8" fill="%230f766e"/>
  <rect x="14"  y="96"  width="8" height="8" fill="%230f766e"/>
  <rect x="46"  y="96"  width="8" height="8" fill="%230f766e"/>
  <rect x="80"  y="96"  width="8" height="8" fill="%230f766e"/>
  <rect x="112" y="96"  width="8" height="8" fill="%230f766e"/>
  <rect x="128" y="96"  width="8" height="8" fill="%230f766e"/>
  <rect x="160" y="96"  width="8" height="8" fill="%230f766e"/>
  <rect x="30"  y="112" width="8" height="8" fill="%230f766e"/>
  <rect x="62"  y="112" width="8" height="8" fill="%230f766e"/>
  <rect x="96"  y="112" width="8" height="8" fill="%230f766e"/>
  <rect x="144" y="112" width="8" height="8" fill="%230f766e"/>
  <rect x="176" y="112" width="8" height="8" fill="%230f766e"/>
  <rect x="80"  y="128" width="8" height="8" fill="%230f766e"/>
  <rect x="96"  y="128" width="8" height="8" fill="%230f766e"/>
  <rect x="128" y="128" width="8" height="8" fill="%230f766e"/>
  <rect x="160" y="128" width="8" height="8" fill="%230f766e"/>
  <rect x="80"  y="144" width="8" height="8" fill="%230f766e"/>
  <rect x="112" y="144" width="8" height="8" fill="%230f766e"/>
  <rect x="144" y="144" width="8" height="8" fill="%230f766e"/>
  <rect x="96"  y="160" width="8" height="8" fill="%230f766e"/>
  <rect x="128" y="160" width="8" height="8" fill="%230f766e"/>
  <rect x="176" y="160" width="8" height="8" fill="%230f766e"/>
  <rect x="80"  y="176" width="8" height="8" fill="%230f766e"/>
  <rect x="112" y="176" width="8" height="8" fill="%230f766e"/>
  <rect x="160" y="176" width="8" height="8" fill="%230f766e"/>
</svg>`;

const PAYMENT_METHODS = [
  { id: "UPI",              label: "UPI",                icon: Smartphone, sub: "Google Pay, PhonePe, Paytm" },
  { id: "Credit Card",      label: "Credit / Debit Card", icon: CreditCard, sub: "Visa, Mastercard, RuPay" },
  { id: "NetBanking",       label: "Net Banking",         icon: Banknote,   sub: "All major banks" },
  { id: "Cash on Delivery", label: "Cash on Delivery",    icon: Banknote,   sub: "Pay when delivered" },
];

const STATES = [
  "Andhra Pradesh","Delhi","Gujarat","Karnataka","Kerala",
  "Maharashtra","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal",
];

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [step, setStep]             = useState<Step>("address");
  const [placing, setPlacing]       = useState(false);
  const [paymentMethod, setPayment] = useState("UPI");
  const [upiCopied, setUpiCopied]   = useState(false);
  const [address, setAddress] = useState({
    name: "", phone: "", addressLine: "", city: "", state: "", pincode: "",
  });

  // Pre-fill name once user loads
  useEffect(() => {
    if (user?.name) setAddress(a => ({ ...a, name: a.name || user.name }));
  }, [user]);

  const savings     = cartItems.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0);
  const delivery    = cartTotal >= 499 ? 0 : 40;
  const finalTotal  = cartTotal + delivery;

  // ── Login gate ─────────────────────────────────────────────────
  if (!isLoading && !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
            <LogIn size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Login to Continue</h2>
          <p className="text-gray-500 text-sm mb-6">
            You need to be logged in to place an order. Your cart items are saved.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login?next=/checkout" className="btn-primary justify-center py-3 text-base font-semibold">
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

  // ── Redirect to cart if empty (effect — safe for SSR) ──────────
  useEffect(() => {
    if (!isLoading && user && cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [isLoading, user, cartItems.length, router]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoading && user && cartItems.length === 0) return null;

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setUpiCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          items: cartItems.map((i) => ({
            productId: i.product.id,
            name:      i.product.name,
            price:     i.product.price,
            quantity:  i.quantity,
            image:     i.product.images[0],
          })),
          total:         finalTotal,
          address,
          paymentMethod,
        }),
      });
      if (!res.ok) throw new Error();
      const { order } = await res.json();
      clearCart();
      toast.success("Order placed! 🎉", { duration: 4000 });
      router.push(`/order-success?id=${order.id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const steps: { key: Step; label: string }[] = [
    { key: "address", label: "Delivery Address" },
    { key: "payment", label: "Payment" },
    { key: "review",  label: "Review Order" },
  ];
  const stepIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
      <div className="mb-4">
        <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      </div>

      {/* Step bar */}
      <div className="bg-navbg rounded-xl px-6 py-4 mb-5 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${i <= stepIdx ? "text-white" : "text-teal-400"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i < stepIdx  ? "bg-accent border-accent text-white" :
                i === stepIdx ? "bg-white text-primary border-white" :
                "border-teal-500 text-teal-400"
              }`}>
                {i < stepIdx ? "✓" : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s.label}</span>
            </div>
            {i < steps.length - 1 && <ChevronRight size={16} className="text-teal-500" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Left panel ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-0">

          {/* STEP 1 — Address */}
          {step === "address" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Delivery Address
              </h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input required value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      placeholder="Your full name" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input required pattern="[0-9]{10}" value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="10-digit mobile number" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <textarea required rows={2} value={address.addressLine}
                    onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                    placeholder="House No., Street, Area, Landmark"
                    className="input-field resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input required value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select required value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="input-field">
                      <option value="">Select State</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input required pattern="[0-9]{6}" value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      placeholder="6-digit pincode" className="input-field" />
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary justify-center py-3 text-base font-semibold mt-2">
                  Continue to Payment <ChevronRight size={16} />
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
                {PAYMENT_METHODS.map(({ id, label, icon: Icon, sub }) => (
                  <label key={id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === id
                        ? "border-primary bg-primary-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <input type="radio" name="payment" value={id}
                      checked={paymentMethod === id} onChange={() => setPayment(id)}
                      className="accent-primary" />
                    <Icon size={20} className={paymentMethod === id ? "text-primary" : "text-gray-400"} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* ── UPI QR Panel ── */}
              {paymentMethod === "UPI" && (
                <div className="border-2 border-primary/30 rounded-xl p-5 bg-primary-50 mb-5">
                  <div className="flex items-center gap-2 mb-4">
                    <QrCode size={18} className="text-primary" />
                    <h3 className="font-semibold text-primary text-sm">Scan &amp; Pay via UPI</h3>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* QR code */}
                    <div className="flex-shrink-0">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 w-fit">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={UPI_QR_SVG} alt="UPI QR Code" className="w-40 h-40" />
                      </div>
                      <p className="text-[11px] text-gray-400 text-center mt-1.5">Scan with any UPI app</p>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3 text-sm w-full">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium">Pay to UPI ID</p>
                        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
                          <span className="flex-1 font-mono text-sm text-gray-800">{UPI_ID}</span>
                          <button onClick={copyUpi}
                            className="text-primary hover:text-primary-dark transition-colors flex items-center gap-1 text-xs font-medium">
                            <Copy size={13} />
                            {upiCopied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium">Amount to Pay</p>
                        <p className="text-2xl font-bold text-primary">₹{finalTotal.toLocaleString()}</p>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                        <strong>Demo mode:</strong> This is a dummy QR. In production, integrate a real UPI payment gateway. Click "Review Order" to proceed.
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                          <span key={app} className="bg-white border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded-lg font-medium">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep("address")} className="btn-outline flex-1 justify-center py-3">
                  ← Back
                </button>
                <button onClick={() => { setStep("review"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="btn-primary flex-1 justify-center py-3 font-semibold">
                  Review Order <ChevronRight size={16} />
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
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm border">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700 flex items-center gap-1"><MapPin size={13} /> Delivery Address</span>
                  <button onClick={() => setStep("address")} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <p className="font-medium text-gray-800">{address.name} · {address.phone}</p>
                <p className="text-gray-500 text-xs mt-0.5">{address.addressLine}, {address.city}, {address.state} – {address.pincode}</p>
              </div>

              {/* Payment recap */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm border">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700 flex items-center gap-1"><CreditCard size={13} /> Payment</span>
                  <button onClick={() => setStep("payment")} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <p className="text-gray-600">{paymentMethod}</p>
                {paymentMethod === "UPI" && <p className="text-xs text-gray-400 mt-0.5">UPI ID: {UPI_ID}</p>}
              </div>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 text-sm">
                    <div className="relative w-14 h-14 bg-gray-50 rounded-lg border flex-shrink-0 overflow-hidden">
                      <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {quantity} × ₹{product.price.toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-gray-900">₹{(product.price * quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep("payment")} className="btn-outline flex-1 justify-center py-3">
                  ← Back
                </button>
                <button onClick={handlePlaceOrder} disabled={placing}
                  className="btn-accent flex-1 justify-center py-3 font-bold text-base">
                  {placing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing…
                    </span>
                  ) : <>Place Order · ₹{finalTotal.toLocaleString()}</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Order summary sidebar ────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm p-5 h-fit sticky top-20">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-4 pb-2 border-b">
            Price Details
          </h3>
          <div className="space-y-2.5 text-sm mb-4">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-gray-600">
                <span className="truncate mr-2 max-w-[160px]">{product.name} ×{quantity}</span>
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
                ? <span className="text-green-600 font-medium">FREE</span>
                : `₹${delivery}`}</span>
            </div>
          </div>
          <div className="border-t border-dashed mt-3 pt-3 flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span><span>₹{finalTotal.toLocaleString()}</span>
          </div>
          {savings > 0 && (
            <p className="text-xs text-green-600 font-medium mt-2 bg-green-50 rounded-lg px-3 py-2 text-center">
              🎉 You save ₹{savings.toLocaleString()} on this order!
            </p>
          )}
          <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
            🔒 Safe & Secure Payments
          </p>
        </div>
      </div>
    </div>
  );
}
