/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#3a3f4b',
          200: '#333842',
          300: '#2c3038',
          400: '#25282e',
          500: '#1e2024',
          600: '#17191d',
          700: '#101216',
          800: '#0a0b0e',
          900: '#050507',
        },
      },
    },
  },
  plugins: [],
};