/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/shared/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        "secondary-foreground":
          "hsl(var(--secondary-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",

        "status-waiting": "hsl(var(--status-waiting) / <alpha-value>)",
        "status-waiting-foreground":
          "hsl(var(--status-waiting-foreground) / <alpha-value>)",
        "status-in-progress": "hsl(var(--status-in-progress) / <alpha-value>)",
        "status-in-progress-foreground":
          "hsl(var(--status-in-progress-foreground) / <alpha-value>)",
        "status-parts": "hsl(var(--status-parts) / <alpha-value>)",
        "status-parts-foreground":
          "hsl(var(--status-parts-foreground) / <alpha-value>)",
        "status-done": "hsl(var(--status-done) / <alpha-value>)",
        "status-done-foreground":
          "hsl(var(--status-done-foreground) / <alpha-value>)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
  plugins: [],
};
