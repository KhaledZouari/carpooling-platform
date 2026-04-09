/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#005ac2",
        "primary-dim": "#004fab",
        "primary-container": "#d8e2ff",
        "on-primary": "#f7f7ff",
        "on-primary-container": "#004eaa",
        surface: "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f4f7",
        "surface-container": "#e8eff3",
        "surface-container-high": "#e1e9ee",
        "surface-variant": "#d9e4ea",
        "on-surface": "#2a3439",
        "on-surface-variant": "#566166",
        outline: "#717c82",
        "outline-variant": "#a9b4b9",
        secondary: "#5e5f65",
        error: "#9f403d",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
