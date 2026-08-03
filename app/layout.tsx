import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider }  from "@/context/AuthContext";
import { CartProvider }  from "@/context/CartContext";
import Navbar            from "@/components/Navbar";
import Footer            from "@/components/Footer";
import { Toaster }       from "react-hot-toast";

export const metadata: Metadata = {
  title: "ShopSphere – Modern E-Commerce",
  description:
    "Shop the best products across Electronics, Fashion, Home & Kitchen and more.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "ShopSphere – Modern E-Commerce",
    description: "Explore. Buy. Smile.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-shopbg antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: "#134e4a",
                  color:      "#f0fdfa",
                  fontSize:   "14px",
                  borderRadius: "10px",
                  border: "1px solid #0f766e",
                },
                success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
                error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
