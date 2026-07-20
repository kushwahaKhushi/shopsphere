import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  "About": [
    { label: "About ShopSphere", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Corporate Information", href: "#" },
  ],
  "Help": [
    { label: "Payments", href: "#" },
    { label: "Shipping", href: "#" },
    { label: "Cancellation & Returns", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  "Consumer Policy": [
    { label: "Return Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Security", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
  "Shop": [
    { label: "All Products", href: "/products" },
    { label: "Electronics", href: "/products?category=Electronics" },
    { label: "Fashion", href: "/products?category=Fashion" },
    { label: "Home & Kitchen", href: "/products?category=Home+%26+Kitchen" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-8">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold">
              <span className="text-white">Shop</span>
              <span className="text-accent">Sphere</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">© 2024 ShopSphere. All rights reserved.</p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-accent" />
              <span>support@shopsphere.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-accent" />
              <span>1800-208-9898</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-accent" />
              <span>Bengaluru, Karnataka, India</span>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 text-center sm:text-right">
              Follow Us
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payments bar */}
      <div className="bg-gray-900 py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
          <span>Secure Payments:</span>
          {["Visa", "Mastercard", "UPI", "NetBanking", "EMI", "Cash on Delivery"].map((p) => (
            <span
              key={p}
              className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-[11px]"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
