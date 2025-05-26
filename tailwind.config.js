/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7fa',
          100: '#cceef5',
          200: '#99dcea',
          300: '#66cbdf',
          400: '#3AA8C1', // Rimuru blue
          500: '#0d95b5',
          600: '#0a7691',
          700: '#08586d',
          800: '#053a48',
          900: '#031d24',
        },
        dark: {
          50: '#f7f7f8',
          100: '#eeeef1',
          200: '#d0d1d9',
          300: '#b3b4c2',
          400: '#9597aa',
          500: '#777993',
          600: '#5e6175',
          700: '#454856',
          800: '#1f2131', // Main background
          900: '#141625',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};