/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export const content = [
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  colors: {
    ...colors,
    background: "var(--color-background)",
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    third: "var(--color-third)",
    bluePrimary: "var(--color-blue-primary)",
    blueSecondary: "var(--color-blue-secondary)",
    activePrimary: "var(--color-active-primary)",
    activeSecondary: "var(--color-active-secondary)",
    error: "var(--color-error)",
  },
  screens: {
    xs: "400px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    "medium-lg": "900px",
    "medium-xl": "1200px",
    xl: "1280px",
    "2xl": "1536px",
  },
  extend: {
    backgroundSize: {
      "size-200": "200% 200%",
    },
    backgroundPosition: {
      "pos-0": "0% 0%",
      "pos-100": "100% 100%",
    },
  },
  fontFamily: {
    sans: ['Roboto', 'sans-serif'],
    thin: ['Roboto-Thin', 'sans-serif'],
  },
};
export const plugins = [];
