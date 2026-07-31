/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef0ff",
          100: "#e0e3ff",
          200: "#c7ccff",
          300: "#a5abff",
          400: "#8a86fb",
          500: "#6d5ef6",
          600: "#5a45ea",
          700: "#4b37cf",
          800: "#3e30a7",
          900: "#362d84",
        },
        teal: {
          400: "#2ee6c6",
          500: "#12d8b6",
          600: "#0bb89b",
        },
        gold: {
          300: "#ffe29a",
          400: "#ffcd5c",
          500: "#f5b331",
          600: "#dd9410",
        },
        // premium near-black canvas + elevated surfaces
        ink: {
          950: "#080711",
          900: "#0c0b17",
          850: "#12111f",
          800: "#171526",
          700: "#211f33",
          600: "#2c2942",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.06)",
        lift: "0 10px 30px rgba(109,94,246,0.35)",
        glow: "0 0 0 1px rgba(109,94,246,0.15), 0 12px 40px rgba(109,94,246,0.18)",
        "glow-lg": "0 0 0 1px rgba(109,94,246,0.18), 0 24px 60px -8px rgba(109,94,246,0.35)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.7)",
        "inner-glass": "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "grid-dark":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        "gradient-pan": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "glow-pulse": "glow-pulse 5s ease-in-out infinite",
        "gradient-pan": "gradient-pan 6s ease infinite",
      },
    },
  },
  plugins: [],
};
