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
          50: "#fdf5f5",
          100: "#fae8e8",
          200: "#f5d5d5",
          300: "#e8b4b4",
          400: "#d99090",
          500: "#c77272",
          600: "#b35a5a",
          700: "#954a4a",
          800: "#7c4040",
          900: "#683a3a",
          950: "#381c1c",
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

