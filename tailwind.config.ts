import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--text-muted)",
        gold: {
          DEFAULT: "var(--gold)",
          soft: "var(--gold-soft)",
          deep: "var(--gold-deep)",
        },
        platinum: "var(--platinum)",
        champagne: "var(--champagne)",
        obsidian: "var(--obsidian)",
        midnight: "var(--midnight)",
        model: "var(--model)",
        harness: "var(--harness)",
        machine: "var(--machine)",
        approval: "var(--approval)",
        fail: "var(--fail)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
