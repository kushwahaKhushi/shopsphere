"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, Home, ShoppingBag } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("id") || "ORD-XXX";

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Your order has been confirmed and is being processed.</p>
        <div className="bg-gray-50 rounded-lg px-6 py-3 inline-block mb-6">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="text-lg font-bold text-primary">{orderId}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/orders" className="flex-1 btn-primary justify-center py-3">
            <Package size={16} /> Track Order
          </Link>
          <Link href="/" className="flex-1 btn-outline justify-center py-3">
            <Home size={16} /> Back to Home
          </Link>
        </div>

        <Link href="/products" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors">
          <ShoppingBag size={14} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
