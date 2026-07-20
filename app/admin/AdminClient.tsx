"use client";

import { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard, Package, ShoppingBag, Plus, Pencil, Trash2,
  X, CheckCircle2, TrendingUp, Users, DollarSign, Search,
} from "lucide-react";
import { Product, Order } from "@/types";
import toast from "react-hot-toast";

type Tab = "dashboard" | "products" | "orders";

interface Props {
  initialProducts: Product[];
  initialOrders: Order[];
}

const EMPTY_FORM = {
  name: "", category: "Electronics", subcategory: "", brand: "",
  price: "", originalPrice: "", stock: "", description: "",
  images: "", features: "", tags: "",
};

export default function AdminClient({ initialProducts, initialOrders }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const processing = orders.filter((o) => o.status === "Processing").length;

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name, category: p.category, subcategory: p.subcategory,
      brand: p.brand, price: String(p.price), originalPrice: String(p.originalPrice),
      stock: String(p.stock), description: p.description,
      images: p.images.join("\n"), features: p.features.join("\n"), tags: p.tags.join(", "),
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name, category: form.category, subcategory: form.subcategory || form.category,
        brand: form.brand, price: Number(form.price), originalPrice: Number(form.originalPrice) || Number(form.price),
        stock: Number(form.stock) || 50, description: form.description,
        images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      };

      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProducts((prev) => prev.map((p) => p.id === editingId ? data.product : p));
        toast.success("Product updated!");
      } else {
        const res = await fetch("/api/products", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProducts((prev) => [...prev, data.product]);
        toast.success("Product added!");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const handleOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: status as any } : o));
      toast.success(`Order status updated to ${status}`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.address.name.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const navItems: { key: Tab; icon: any; label: string }[] = [
    { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { key: "products", icon: Package, label: "Products" },
    { key: "orders", icon: ShoppingBag, label: "Orders" },
  ];

  const F = ({ label, name, type = "text", placeholder = "" }: { label: string; name: keyof typeof form; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder} className="input-field text-sm" />
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-16 sm:w-52 bg-gray-900 text-white flex-shrink-0 flex flex-col">
        <div className="px-4 py-5 hidden sm:block border-b border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Admin Panel</p>
          <p className="text-sm font-bold text-white mt-0.5">ShopSphere</p>
        </div>
        <nav className="flex flex-col gap-1 p-2 mt-2">
          {navItems.map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                tab === key ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}>
              <Icon size={18} />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        {/* Dashboard */}
        {tab === "dashboard" && (
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Products", value: products.length, icon: Package, color: "bg-primary", sub: "in catalogue" },
                { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "bg-purple-500", sub: "all time" },
                { label: "Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: "bg-green-500", sub: "total revenue" },
                { label: "Customers", value: Array.from(new Set(orders.map((o: Order) => o.userId))).length, icon: Users, color: "bg-orange-500", sub: "unique users" },
              ].map(({ label, value, icon: Icon, color, sub }) => (
                <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
                  <div className={`${color} p-3 rounded-xl`}><Icon size={22} className="text-white" /></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    <p className="text-[11px] text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-primary" /> Order Status</h3>
                {[
                  { label: "Processing", count: processing, color: "bg-orange-400" },
                  { label: "Shipped", count: orders.filter((o) => o.status === "Shipped").length, color: "bg-blue-400" },
                  { label: "Delivered", count: delivered, color: "bg-green-500" },
                  { label: "Cancelled", count: orders.filter((o) => o.status === "Cancelled").length, color: "bg-red-400" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-600 w-24">{label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full`} style={{ width: orders.length ? `${(count / orders.length) * 100}%` : "0%" }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-gray-800 mb-3">Recent Orders</h3>
                <div className="space-y-2">
                  {[...orders].reverse().slice(0, 5).map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-gray-600">{o.id}</span>
                      <span className="text-gray-500 truncate mx-2">{o.address.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        o.status === "Delivered" ? "bg-green-100 text-green-700" :
                        o.status === "Processing" ? "bg-orange-100 text-orange-700" :
                        o.status === "Shipped" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                      }`}>{o.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products tab */}
        {tab === "products" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h1 className="text-xl font-bold text-gray-800">Products ({products.length})</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center border bg-white rounded overflow-hidden shadow-sm">
                  <Search size={14} className="ml-3 text-gray-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
                    className="px-2 py-2 text-sm outline-none w-48" />
                </div>
                <button onClick={openAdd} className="btn-primary text-sm py-2 gap-1.5">
                  <Plus size={15} /> Add Product
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-gray-100 rounded border flex-shrink-0">
                            <Image src={p.images[0]} alt={p.name} fill className="object-contain p-1" unoptimized />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                        <span className="bg-primary-light text-primary text-xs px-2 py-0.5 rounded font-medium">{p.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">₹{p.price.toLocaleString()}</p>
                        {p.discount > 0 && <p className="text-xs text-green-600">{p.discount}% off</p>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${p.stock < 10 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)}
                            className="p-1.5 text-primary hover:bg-primary-light rounded transition-colors" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(p.id, p.name)} disabled={deleting === p.id}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-40" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="py-12 text-center text-gray-400">No products found</div>
              )}
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === "orders" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h1 className="text-xl font-bold text-gray-800">Orders ({orders.length})</h1>
              <div className="flex items-center border bg-white rounded overflow-hidden shadow-sm">
                <Search size={14} className="ml-3 text-gray-400" />
                <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders…" className="px-2 py-2 text-sm outline-none w-48" />
              </div>
            </div>

            <div className="space-y-3">
              {[...filteredOrders].reverse().map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{order.id}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}{order.paymentMethod}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1.5 rounded border focus:outline-none focus:ring-1 focus:ring-primary ${
                          order.status === "Delivered" ? "bg-green-50 text-green-700 border-green-200" :
                          order.status === "Processing" ? "bg-orange-50 text-orange-700 border-orange-200" :
                          order.status === "Shipped" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {["Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    📍 {order.address.name} — {order.address.addressLine}, {order.address.city}, {order.address.state} {order.address.pincode}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-gray-50 rounded px-2 py-1 text-xs text-gray-600">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-400">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="bg-white rounded-xl p-12 text-center text-gray-400">No orders found</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit product modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                {editingId ? <><Pencil size={16} /> Edit Product</> : <><Plus size={16} /> Add New Product</>}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <F label="Product Name *" name="name" placeholder="e.g. Samsung Galaxy S24" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm">
                    {["Electronics", "Fashion", "Home & Kitchen", "Sports & Outdoors"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <F label="Subcategory" name="subcategory" placeholder="e.g. Smartphones" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <F label="Brand" name="brand" placeholder="e.g. Samsung" />
                <F label="Stock" name="stock" type="number" placeholder="50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <F label="Selling Price (₹) *" name="price" type="number" placeholder="24999" />
                <F label="Original Price (₹)" name="originalPrice" type="number" placeholder="29999" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} placeholder="Product description…" className="input-field text-sm resize-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Image URLs (one per line)</label>
                <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
                  rows={2} placeholder="https://example.com/img1.jpg" className="input-field text-sm resize-none font-mono text-xs" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Features (one per line)</label>
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={3} placeholder="Feature 1&#10;Feature 2" className="input-field text-sm resize-none" />
              </div>

              <F label="Tags (comma separated)" name="tags" placeholder="smartphone, 5g, flagship" />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-outline justify-center py-2.5">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center py-2.5 disabled:opacity-60">
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><CheckCircle2 size={15} /> {editingId ? "Save Changes" : "Add Product"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
