/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enabling class-based dark mode
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff00',
          dark: '#0a0a0a',
          boxBg: '#111111',
          border: '#333333'
        }
      },
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'], // Or any other futuristic font
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00',
        neonSoft: '0 0 5px #00ff00, 0 0 10px #00ff00',
      }
    },
  },
  plugins: [],
}
