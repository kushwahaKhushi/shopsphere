"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package, CheckCircle2, Truck, Clock, XCircle,
  ArrowLeft, MapPin, CreditCard, Loader2,
} from "lucide-react";
import { Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Breadcrumb from "@/components/Breadcrumb";

const TIMELINE_STEPS = [
  {
    key: "Processing",
    icon: Clock,
    label: "Order Placed",
    desc: "Your order has been received and is being processed.",
  },
  {
    key: "Shipped",
    icon: Truck,
    label: "Shipped",
    desc: "Your order is on its way to you.",
  },
  {
    key: "Delivered",
    icon: CheckCircle2,
    label: "Delivered",
    desc: "Package delivered successfully.",
  },
];

const STATUS_COLOR: Record<string, string> = {
  Processing: "text-orange-600 bg-orange-50 border-orange-200",
  Shipped:    "text-blue-600 bg-blue-50 border-blue-200",
  Delivered:  "text-green-600 bg-green-50 border-green-200",
  Cancelled:  "text-red-500 bg-red-50 border-red-200",
};

export default function OrderTrackingPage() {
  const { id }         = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();
  const router         = useRouter();
  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setOrder)
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={36} className="text-primary animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <Package size={64} className="text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Order Not Found</h2>
        <p className="text-gray-400 mb-6">We couldn&apos;t find this order.</p>
        <Link href="/orders" className="btn-primary">← Back to Orders</Link>
      </div>
    );
  }

  const isCancelled = order.status === "Cancelled";
  const activeIdx   = TIMELINE_STEPS.findIndex((s) => s.key === order.status);

  // Estimated delivery: 5 days from order date
  const estDelivery = new Date(order.createdAt);
  estDelivery.setDate(estDelivery.getDate() + 5);

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4">
      <div className="mb-4">
        <Breadcrumb crumbs={[
          { label: "Home", href: "/" },
          { label: "My Orders", href: "/orders" },
          { label: order.id },
        ]} />
      </div>

      {/* Back */}
      <Link href="/orders" className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-4">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      {/* Top card */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Order {order.id}</h1>
            <p className="text-sm text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_COLOR[order.status] ?? STATUS_COLOR.Processing}`}>
            {order.status === "Processing" && <Clock size={13} />}
            {order.status === "Shipped"    && <Truck size={13} />}
            {order.status === "Delivered"  && <CheckCircle2 size={13} />}
            {order.status === "Cancelled"  && <XCircle size={13} />}
            {order.status}
          </span>
        </div>

        {/* Timeline */}
        {!isCancelled ? (
          <div>
            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />
              <div
                className="absolute left-4 top-4 w-0.5 bg-primary transition-all duration-500"
                style={{ height: activeIdx >= 0 ? `${(activeIdx / (TIMELINE_STEPS.length - 1)) * 100}%` : "0%" }}
              />

              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const done    = i <= activeIdx;
                  const current = i === activeIdx;
                  const Icon    = step.icon;
                  return (
                    <div key={step.key} className="relative flex items-start gap-4 pb-6 last:pb-0">
                      {/* Circle */}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                        done
                          ? current
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                            : "bg-primary border-primary text-white"
                          : "bg-white border-gray-300 text-gray-300"
                      }`}>
                        <Icon size={15} strokeWidth={2.5} />
                      </div>
                      {/* Content */}
                      <div className="flex-1 pt-0.5">
                        <p className={`text-sm font-semibold ${done ? "text-gray-800" : "text-gray-400"}`}>
                          {step.label}
                          {current && (
                            <span className="ml-2 text-[10px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded uppercase tracking-wide">
                              Current
                            </span>
                          )}
                        </p>
                        <p className={`text-xs mt-0.5 ${done ? "text-gray-500" : "text-gray-300"}`}>{step.desc}</p>
                        {current && step.key !== "Delivered" && (
                          <p className="text-xs text-primary font-medium mt-1">
                            Est. delivery: {estDelivery.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        )}
                        {done && !current && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
            <XCircle size={20} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
              <p className="text-xs text-red-400 mt-0.5">This order has been cancelled.</p>
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4 border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package size={16} className="text-primary" /> Order Items
        </h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gray-50 rounded-lg border overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-contain p-1.5" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                </p>
              </div>
              <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Price summary */}
        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Items total</span>
            <span>₹{order.items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
            <span>Order Total</span>
            <span>₹{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Delivery + Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin size={15} className="text-primary" /> Delivery Address
          </h3>
          <p className="text-sm font-semibold text-gray-800">{order.address.name}</p>
          <p className="text-sm text-gray-600 mt-0.5">{order.address.phone}</p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {order.address.addressLine},<br />
            {order.address.city}, {order.address.state}<br />
            {order.address.pincode}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CreditCard size={15} className="text-primary" /> Payment
          </h3>
          <p className="text-sm font-semibold text-gray-800">{order.paymentMethod}</p>
          <p className="text-sm text-gray-500 mt-1">Amount: ₹{order.total.toLocaleString()}</p>
          <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
            <CheckCircle2 size={11} /> Payment Confirmed
          </span>
        </div>
      </div>
    </div>
  );
}
