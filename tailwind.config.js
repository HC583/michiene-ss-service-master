/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        pop: "pop 0.55s ease-out both",
        sparkle: "sparkle 1.1s ease-in-out infinite",
        floaty: "floaty 3s ease-in-out infinite",
        wiggleSoft: "wiggleSoft 0.55s ease-in-out",
        gauge: "gauge 1.25s ease-in-out infinite alternate"
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(.75) translateY(12px)", opacity: "0" },
          "55%": { transform: "scale(1.12) translateY(-4px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" }
        },
        sparkle: {
          "0%, 100%": { transform: "scale(.9) rotate(0deg)", opacity: ".55" },
          "50%": { transform: "scale(1.2) rotate(12deg)", opacity: "1" }
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        wiggleSoft: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-2deg)" },
          "75%": { transform: "rotate(2deg)" }
        },
        gauge: {
          "0%": { left: "0%" },
          "100%": { left: "96%" }
        }
      }
    }
  },
  plugins: []
};
