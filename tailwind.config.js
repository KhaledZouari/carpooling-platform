/** @type {import('tailwindcss').Config} */
const colorVar = (name) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `rgb(var(${name}))`
    : `rgb(var(${name}) / ${opacityValue})`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colorVar("--color-primary"),
        "primary-dim": colorVar("--color-primary-dim"),
        "primary-container": colorVar("--color-primary-container"),
        "on-primary": colorVar("--color-on-primary"),
        "on-primary-container": colorVar("--color-on-primary-container"),
        surface: colorVar("--color-surface"),
        "surface-container-lowest": colorVar("--color-surface-container-lowest"),
        "surface-container-low": colorVar("--color-surface-container-low"),
        "surface-container": colorVar("--color-surface-container"),
        "surface-container-high": colorVar("--color-surface-container-high"),
        "surface-variant": colorVar("--color-surface-variant"),
        "on-surface": colorVar("--color-on-surface"),
        "on-surface-variant": colorVar("--color-on-surface-variant"),
        outline: colorVar("--color-outline"),
        "outline-variant": colorVar("--color-outline-variant"),
        secondary: colorVar("--color-secondary"),
        "on-secondary": colorVar("--color-on-secondary"),
        "secondary-container": colorVar("--color-secondary-container"),
        "on-secondary-container": colorVar("--color-on-secondary-container"),
        warning: colorVar("--color-warning"),
        error: colorVar("--color-error"),
        "on-error": colorVar("--color-on-error"),
        scrim: colorVar("--color-scrim"),
      },
      borderRadius: {
        DEFAULT: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px",
      },
      fontFamily: {
        sans: ["IBM Plex Sans Condensed", "sans-serif"],
        headline: ["IBM Plex Sans Condensed", "sans-serif"],
        body: ["IBM Plex Sans Condensed", "sans-serif"],
        label: ["IBM Plex Sans Condensed", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
