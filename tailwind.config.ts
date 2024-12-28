import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(0deg, #b388eb, #9f7ce4, #8a6fde, #7b5bd8, #6f47d0, #5c34c4, #4a24b8, #3d1d9f, #341788, #2e1273, #270d5e, #210849, #3d1d9f, #5c34c4, #8a6fde)",
        "overlay-pattern": `radial-gradient(circle at 20% 20%, #ffffff33 20px, transparent 0),
                            radial-gradient(circle at 80% 40%, #ffffff33 25px, transparent 0),
                            radial-gradient(circle at 40% 80%, #ffffff33 30px, transparent 0),
                            linear-gradient(135deg, transparent 20%, #ffffff33 20%, transparent 40%)`,
      },
      backgroundSize: {
        gradient: "400% 400%",
        overlay: "150px 150px, 200px 200px, 250px 250px, 300px 300px",
      },
      keyframes: {
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "25%": { backgroundPosition: "50% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "75%": { backgroundPosition: "50% 100%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        blurEffect: {
          "0%, 100%": { filter: "blur(5px)" },
          "50%": { filter: "blur(15px)" },
        },
      },
      animation: {
        gradientShift: "gradientShift 15s ease infinite",
        blurEffect: "blurEffect 10s ease-in-out infinite",
      },
      opacity: {
        "45": "0.45",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
