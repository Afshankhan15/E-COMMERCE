// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.8)' },
        },
      },
      animation: {
        'pulse-border': 'pulse-border 2s infinite',
      },
    },
  },
  // darkMode: "class",
  plugins: [],
};