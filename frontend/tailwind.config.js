/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#166534", // Forest Green
        secondary: "#10B981", // Emerald
        accent: "#FACC15", // Warm Yellow
        background: "#FAFAFA", // Off white
        dark: "#111827", // Dark gray
      },
      borderRadius: {
        '2xl': '16px',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
