import { Truck, RefreshCw, ShieldCheck, Headphones } from "lucide-react";

const ITEMS = [
  { Icon: Truck,        label: "Free Delivery",  sub: "On orders above ₹499",   color: "bg-teal-50  text-teal-600"   },
  { Icon: RefreshCw,    label: "Easy Returns",   sub: "7-day hassle-free",       color: "bg-orange-50 text-orange-500" },
  { Icon: ShieldCheck,  label: "Secure Payment", sub: "100% protected",          color: "bg-green-50  text-green-600"  },
  { Icon: Headphones,   label: "24/7 Support",   sub: "Dedicated help centre",   color: "bg-purple-50 text-purple-600" },
];

export default function TrustBar() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
        {ITEMS.map(({ Icon, label, sub, color }) => (
          <div key={label} className="flex items-center gap-3 px-4 py-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={17} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 leading-tight">{label}</p>
              <p className="text-[11px] text-gray-400 leading-tight">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
