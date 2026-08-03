import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f766e",
          dark:    "#115e59",
          light:   "#ccfbf1",
          50:      "#f0fdfa",
          100:     "#ccfbf1",
          200:     "#99f6e4",
        },
        accent: {
          DEFAULT: "#f97316",
          dark:    "#ea580c",
          light:   "#fff7ed",
          50:      "#fff7ed",
        },
        navbg:  "#0d3d39",
        shopbg: "#f8fafc",
        surface: "#ffffff",
        muted:   "#f1f5f9",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card:      "0 2px 8px 0 rgba(0,0,0,0.06)",
        "card-lg": "0 8px 30px 0 rgba(0,0,0,0.10)",
        glow:      "0 0 20px rgba(15,118,110,0.25)",
        "glow-accent": "0 0 20px rgba(249,115,22,0.30)",
      },
      backgroundImage: {
        "gradient-teal": "linear-gradient(135deg, #0d3d39 0%, #0f766e 100%)",
        "gradient-warm": "linear-gradient(135deg, #f97316 0%, #fbbf24 100%)",
        "gradient-card": "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
      },
      animation: {
        "fade-up":   "fadeUp 0.4s ease both",
        "pulse-dot": "pulseDot 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "float":     "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: ".4" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
