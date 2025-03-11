import type { Config } from "tailwindcss";

const COLORS = {
  white: "#fff",
  pink: {
    DEFAULT: "#fd66a3",
    100: "#46011d",
    200: "#8d023a",
    300: "#d30356",
    400: "#fc2279",
    500: "#fd66a3",
    600: "#fd86b6",
    700: "#fea5c8",
    800: "#fec3da",
    900: "#ffe1ed",
  },
  blue: {
    DEFAULT: "#569fe8",
    100: "#082038",
    200: "#0f3f6f",
    300: "#175fa7",
    400: "#1e7edf",
    500: "#569fe8",
    600: "#77b1ec",
    700: "#99c5f1",
    800: "#bbd8f6",
    900: "#ddecfa",
  },
  onyx: {
    DEFAULT: "#343839",
    100: "#0a0b0b",
    200: "#141616",
    300: "#1f2122",
    400: "#292c2d",
    500: "#343839",
    600: "#596163",
    700: "#808a8c",
    800: "#aab1b2",
    900: "#d5d8d9",
  },
  green: {
    DEFAULT: "#3fd977",
    100: "#092f17",
    200: "#135e2e",
    300: "#1c8d45",
    400: "#25bb5c",
    500: "#3fd977",
    600: "#66e193",
    700: "#8ce8ae",
    800: "#b2f0c9",
    900: "#d9f7e4",
  },
  yellow: {
    DEFAULT: "#fafa0c",
    100: "#333301",
    200: "#666602",
    300: "#999903",
    400: "#cccc04",
    500: "#fafa0c",
    600: "#fbfb3b",
    700: "#fcfc6c",
    800: "#fdfd9d",
    900: "#fefece",
  },
};

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      ...COLORS,
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      chart: {
        "1": "hsl(var(--chart-1))",
        "2": "hsl(var(--chart-2))",
        "3": "hsl(var(--chart-3))",
        "4": "hsl(var(--chart-4))",
        "5": "hsl(var(--chart-5))",
      },
    },
    extend: {
      dropShadow: {
        "solid-onyx": `0.05em 0.05em 0px ${COLORS.onyx.DEFAULT}`,
      },
      animation: {
        fade: "fade 150ms ease-in 1",
      },
      keyframes: {
        fade: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
