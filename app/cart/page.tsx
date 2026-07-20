"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Breadcrumb from "@/components/Breadcrumb";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const originalTotal = cartItems.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0);
  const savings = originalTotal - cartTotal;
  const deliveryCharge = cartTotal >= 499 ? 0 : 40;
  const finalTotal = cartTotal + deliveryCharge;

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    toast.success(`${name} removed from cart`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <ShoppingBag size={80} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add items to your cart and they will show up here</p>
        <Link href="/products" className="btn-primary text-base px-8 py-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      <div className="mb-4">
        <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-lg shadow-sm px-4 py-3 flex items-center justify-between">
            <h1 className="font-bold text-gray-800 text-lg">
              My Cart <span className="text-gray-400 font-normal text-sm">({totalItems} {totalItems === 1 ? "item" : "items"})</span>
            </h1>
            <span className="text-sm text-green-600 font-semibold">
              You save ₹{savings.toLocaleString()}!
            </span>
          </div>

          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
              {/* Image */}
              <Link href={`/product/${product.id}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded border overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
                  <p className="text-xs text-gray-400 font-medium">{product.brand}</p>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mt-0.5">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-base font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-green-600 font-semibold">
                    {product.discount}% off
                  </span>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                      disabled={quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-1.5 font-semibold text-sm border-x bg-gray-50">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(product.id, product.name)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors ml-2"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-xs text-gray-400">Subtotal</p>
                <p className="font-bold text-gray-900 text-base">
                  ₹{(product.price * quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

          {/* Coupon */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3">
              <Tag size={16} className="text-primary flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 input-field"
              />
              <button className="btn-outline text-sm px-4 py-2">Apply</button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-4 pb-2 border-b">
              Price Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Price ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                <span>₹{originalTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>− ₹{savings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charges</span>
                {deliveryCharge === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>₹{deliveryCharge}</span>
                )}
              </div>
            </div>

            <div className="border-t border-dashed mt-4 pt-4 flex justify-between font-bold text-base text-gray-900">
              <span>Total Amount</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>

            {savings > 0 && (
              <p className="text-green-600 text-sm font-medium mt-2 bg-green-50 rounded px-3 py-2">
                🎉 You will save ₹{savings.toLocaleString()} on this order!
              </p>
            )}

            <button
              onClick={() => router.push("/checkout")}
              className="w-full mt-4 btn-accent justify-center py-3 text-base font-bold"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            {/* Safe checkout badge */}
            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              🔒 Safe and Secure Payments. 100% Authentic Products.
            </p>
          </div>

          {/* Continue shopping */}
          <Link
            href="/products"
            className="block text-center text-sm text-primary hover:underline py-2"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
