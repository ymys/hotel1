/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        vinotel: {
          primary: '#0f766e', // Deep teal
          secondary: '#f59e0b', // Warm gold
          gray: {
            50: '#f8fafc',
            900: '#374151'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
};
