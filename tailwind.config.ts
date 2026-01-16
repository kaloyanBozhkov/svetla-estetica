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
        primary: {
          50: "#f9f7fa",
          100: "#f0ecf0",
          200: "#e4dce5",
          300: "#d5c3d6",
          400: "#b89aba",
          500: "#9b7299",
          600: "#7d5580",
          700: "#633068",
          800: "#5f2867",
          900: "#4a1f50",
          950: "#2d1330",
        },
        accent: {
          50: "#fdf4f8",
          100: "#fce8f1",
          200: "#fad1e4",
          300: "#f7abce",
          400: "#f078ad",
          500: "#e54d8c",
          600: "#d32d6b",
          700: "#b11f52",
          800: "#931d45",
          900: "#7b1d3d",
          950: "#4a0a20",
        },
        background: {
          DEFAULT: "#fdfbfc",
          dark: "#1a1418",
        },
      },
      fontFamily: {
        sans: ["var(--font-lora)", "serif"],
        display: ["var(--font-cormorant)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

