import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Airbnb-inspired palette
        airbnb: {
          red: "#FF385C",
          "red-hover": "#E31C5F",
          "red-light": "#FFF0F3",
          dark: "#222222",
          gray: "#717171",
          "gray-light": "#B0B0B0",
          border: "#DDDDDD",
          "bg-light": "#F7F7F7",
          "bg-hover": "#F2F2F2",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 8px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)",
        nav: "0 1px 0 rgba(0,0,0,0.08)",
        modal: "0 8px 32px rgba(0,0,0,0.18)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
