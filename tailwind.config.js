/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        primaryDark: "#1E40AF",
        primaryLight: "#DBEAFE",
        background: "#F8FAFC",
        success: "#22C55E",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};