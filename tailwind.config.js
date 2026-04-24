/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ccff00", // Electric Lime
        "primary-dim": "#a3cc00",
        "primary-container": "#1f2937",
        "on-primary": "#000000",
        "on-primary-container": "#ccff00",
        surface: "#09090b", // Deep Charcoal
        "surface-container-lowest": "#121214",
        "surface-container-low": "#18181b",
        "surface-container": "#27272a",
        "surface-container-high": "#3f3f46",
        "surface-variant": "#27272a",
        "on-surface": "#fafafa",
        "on-surface-variant": "#a1a1aa",
        outline: "#3f3f46",
        "outline-variant": "#27272a",
        secondary: "#8b5cf6", // Vibrant Violet
        error: "#ef4444",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        headline: ["Syne", "sans-serif"],
        body: ["Outfit", "sans-serif"],
        label: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
