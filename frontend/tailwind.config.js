/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0B0E14",
        surface: "#12151C",
        border: "#232733",
        ink: "#EDEEF2",
        muted: "#9096A8",
        accent: "#7C86FF",
        signal: "#F5A623",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(124,134,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,134,255,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};
