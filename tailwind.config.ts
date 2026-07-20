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
          DEFAULT: "#0f766e",   // teal-700
          dark:    "#115e59",   // teal-800
          light:   "#ccfbf1",   // teal-100
          50:      "#f0fdfa",
        },
        accent: {
          DEFAULT: "#f97316",   // orange-500
          dark:    "#ea580c",   // orange-600
          light:   "#fff7ed",   // orange-50
        },
        shopbg: "#f3f4f6",      // neutral page bg
        navbg:  "#134e4a",      // teal-900 for navbar
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
