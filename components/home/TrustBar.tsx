import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";

const items = [
  { icon: Truck, label: "Free Delivery", sub: "On orders above ₹499" },
  { icon: RefreshCw, label: "Easy Returns", sub: "7-day hassle-free" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "100% protected" },
  { icon: Headphones, label: "24/7 Support", sub: "Dedicated help centre" },
];

export default function TrustBar() {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x">
        {items.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-2.5 px-3 py-2">
            <Icon size={22} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-gray-800">{label}</p>
              <p className="text-[11px] text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
