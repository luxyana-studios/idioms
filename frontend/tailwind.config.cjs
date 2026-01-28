/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#8B7355',
        secondary: '#A7C4A0',
        accent: '#D4A574',
        muted: '#E8E2D9',
        light: {
          100: '#FAF7F2',
          200: '#E8E2D9',
          300: '#E5DDD3',
        },
        dark: {
          100: '#2D2A26',
          200: '#1E1B18',
        },
        earth: {
          sand: '#E5DDD3',
          moss: '#7A8B6E',
          clay: '#C4956A',
          stone: '#9B9388',
        },
      },
    },
  },
  plugins: [],
};
