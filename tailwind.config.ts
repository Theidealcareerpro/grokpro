// tailwind.config.ts
// No imports here—avoids TS moduleResolution issues in editors.

const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      // Semantic color tokens mapped to CSS variables (from your new palette)
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",

        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
        info: "hsl(var(--info))",
        "info-foreground": "hsl(var(--info-foreground))",

        // Back-compat aliases you already use
        navy: { 700: "#1E3A8A" },
        slate: { 200: "#E2E8F0" },
        teal: { 500: "#14B8A6", 600: "#0F766E", 700: "#0F766E" },
        gray: { 50: "#F9FAFB", 600: "#4B5563", 800: "#1F2937" },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      boxShadow: {
        card:
          "0 1px 2px hsl(var(--overlay-1)), 0 8px 24px hsl(var(--overlay-2))",
      },

      backgroundImage: {
        "brand-radial":
          "radial-gradient(40rem 30rem at 50% -10%, hsl(var(--secondary) / 0.18), transparent 60%)",
        "brand-conic":
          "conic-gradient(from 180deg at 50% -20%, hsl(var(--accent) / 0.18), transparent 25% 75%, hsl(var(--primary) / 0.18))",
        "brand-gradient":
          "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)) 50%, hsl(var(--accent)))",
      },
    },
  },
  plugins: [],
} as const;

export default config;
