"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Package, CheckCircle2, Truck, Clock, XCircle,
  ChevronDown, ChevronUp, MapPin, CreditCard, Eye,
} from "lucide-react";
import { Order } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";

const STATUS_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  Processing: { icon: Clock,        color: "text-orange-600", bg: "bg-orange-50 border-orange-200",  label: "Processing"  },
  Shipped:    { icon: Truck,        color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",      label: "Shipped"     },
  Delivered:  { icon: CheckCircle2, color: "text-green-600",  bg: "bg-green-50 border-green-200",    label: "Delivered"   },
  Cancelled:  { icon: XCircle,      color: "text-red-500",    bg: "bg-red-50 border-red-200",        label: "Cancelled"   },
};

// Timeline steps — which step is active for each status
const TIMELINE_STEPS = ["Processing", "Shipped", "Delivered"] as const;

function OrderTimeline({ status }: { status: string }) {
  const activeIdx = TIMELINE_STEPS.indexOf(status as any);
  const isCancelled = status === "Cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 py-3">
        <XCircle size={16} className="text-red-500" />
        <span className="text-sm text-red-500 font-medium">This order was cancelled.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 py-4 overflow-x-auto">
      {TIMELINE_STEPS.map((step, i) => {
        const done    = i <= activeIdx;
        const current = i === activeIdx;
        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            {/* Node */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done
                  ? current
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/30"
                    : "bg-primary border-primary text-white"
                  : "bg-white border-gray-300 text-gray-300"
              }`}>
                {done && !current
                  ? <CheckCircle2 size={16} strokeWidth={2.5} />
                  : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${done ? "text-primary" : "text-gray-400"}`}>
                {step}
              </span>
            </div>
            {/* Connector */}
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 rounded transition-all ${i < activeIdx ? "bg-primary" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.Processing;
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b bg-gray-50/60">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Order ID</p>
            <p className="font-bold text-gray-800 text-sm">{order.id}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Placed on</p>
            <p className="text-sm text-gray-700">
              {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Total</p>
            <p className="font-bold text-gray-900 text-sm">₹{order.total.toLocaleString()}</p>
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Payment</p>
            <p className="text-sm text-gray-700">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color}`}>
            <StatusIcon size={13} />
            {cfg.label}
          </span>
          <Link href={`/orders/${order.id}`}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
            <Eye size={13} /> Track
          </Link>
          <button onClick={() => setExpanded(v => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5">
        <OrderTimeline status={order.status} />
      </div>

      {/* Items preview — always visible (first 2) */}
      <div className="px-5 pb-4 space-y-3">
        {order.items.slice(0, expanded ? undefined : 2).map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="relative w-14 h-14 bg-gray-50 rounded-lg border flex-shrink-0 overflow-hidden">
              <Image src={item.image} alt={item.name} fill className="object-contain p-1" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-gray-900 text-sm flex-shrink-0">
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}

        {!expanded && order.items.length > 2 && (
          <button onClick={() => setExpanded(true)}
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            +{order.items.length - 2} more items <ChevronDown size={12} />
          </button>
        )}
      </div>

      {/* Expanded: address + payment */}
      {expanded && (
        <div className="border-t px-5 py-4 bg-gray-50/50 space-y-3 text-sm">
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-gray-700">{order.address.name}</span>
              {" · "}{order.address.phone}
              <br />
              <span className="text-xs text-gray-400">
                {order.address.addressLine}, {order.address.city}, {order.address.state} – {order.address.pincode}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <CreditCard size={14} className="text-primary flex-shrink-0" />
            <span>Paid via <strong className="text-gray-700">{order.paymentMethod}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Package size={80} className="text-gray-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
        <p className="text-gray-400 mb-8">Your order history will appear here once you place an order.</p>
        <Link href="/products" className="btn-primary py-3 px-8">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4">
      <div className="mb-4">
        <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "My Orders" }]} />
      </div>
      <h1 className="text-xl font-bold text-gray-800 mb-1">My Orders</h1>
      <p className="text-sm text-gray-500 mb-5">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
