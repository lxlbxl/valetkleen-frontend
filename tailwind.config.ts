import type { Config } from "tailwindcss";

// The visual system lives in src/styles (ported from the Style D mockups) and is driven by CSS
// variables. Tailwind is used for layout utilities on top of it; preflight is off so it does not
// fight the design's own reset.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        deep: "#0a2336",
        navy: "#10324A",
        blue: "#005C9F",
        aqua: "#36C5CC",
        ice: "#9fd8f5",
        mut: "var(--mut)",
        hc: "var(--hc)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
