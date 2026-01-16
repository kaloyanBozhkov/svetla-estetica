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
          50: "#faf8f2",
          100: "#f3efe1",
          200: "#e6dcc2",
          300: "#d5c49c",
          400: "#c4a875",
          500: "#b8925a",
          600: "#ab7f4e",
          700: "#8e6542",
          800: "#74533b",
          900: "#5f4532",
          950: "#332319",
        },
        background: {
          DEFAULT: "#fdfbf9",
          dark: "#1a1614",
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

