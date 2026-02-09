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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",

        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",

        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        "status-waiting": "hsl(45, 93%, 47%)",
        "status-waiting-foreground": "hsl(45, 93%, 15%)",
        "status-in-progress": "hsl(217, 91%, 60%)",
        "status-in-progress-foreground": "hsl(0, 0%, 100%)",
        "status-parts": "hsl(25, 95%, 53%)",
        "status-parts-foreground": "hsl(0, 0%, 100%)",
        "status-done": "hsl(142, 71%, 45%)",
        "status-done-foreground": "hsl(0, 0%, 100%)",

        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
  plugins: [],
};
