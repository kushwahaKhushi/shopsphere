"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import OrdersClient from "./OrdersClient";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [fetching, setFetch]  = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetch(true);
    fetch(`/api/orders?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        // API returns array directly
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setFetch(false));
  }, [user]);

  if (isLoading || fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={36} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <LogIn size={40} className="text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Login to view orders</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to see your order history and track deliveries.</p>
          <Link href="/login?next=/orders" className="btn-primary justify-center py-3 w-full">
            <LogIn size={16} /> Sign In
          </Link>
        </div>
      </div>
    );
  }

  return <OrdersClient orders={orders} />;
}
