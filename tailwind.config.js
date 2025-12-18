/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cradle: {
          bg: '#FDFCF8',
          text: '#2A2420',
          accent: '#8C7B70',
          card: '#F4F1EA',
          warm: '#E8E1D5',
          btn: '#3E342F',
          brand: '#D97757' // Terracotta/Clay from image
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Crimson Pro', 'Georgia', 'serif'],
      },
      animation: {
        'orbit': 'orbit 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}

