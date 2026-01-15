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
          50: "#fdf4f3",
          100: "#fce8e6",
          200: "#f9d4d1",
          300: "#f4b5af",
          400: "#ec8b82",
          500: "#df6257",
          600: "#cb4537",
          700: "#aa372b",
          800: "#8d3127",
          900: "#762e26",
          950: "#40150f",
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

