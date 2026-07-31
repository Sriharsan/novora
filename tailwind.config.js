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
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -24px rgba(0,0,0,0.7)",
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
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
