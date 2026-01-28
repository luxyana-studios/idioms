/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Organic Flow Primary Palette
        primary: '#A7C4A0', // Sage green - dominant
        secondary: '#D4A574', // Terracotta - warm accent
        accent: '#8B7355', // Taupe - grounding
        muted: '#E8E2D9',
        // Light shades
        light: {
          100: '#FAF7F2', // Cream background
          200: '#F0EBE3', // Warm off-white surface
          300: '#E5DDD3', // Soft border
        },
        // Dark shades (forest-inspired)
        dark: {
          100: '#2D2A26', // Charcoal text
          200: '#1E2420', // Deep forest
          300: '#2A302B', // Dark sage surface
        },
        // Organic earth tones
        earth: {
          sand: '#E5DDD3',
          moss: '#7A8B6E', // Secondary text color
          clay: '#D4A574', // Terracotta
          stone: '#8B7355', // Taupe
        },
        // Sage palette
        sage: {
          50: '#F5F8F4',
          100: '#E8F0E6',
          200: '#D4E4D0',
          300: '#B8D4B0',
          400: '#A7C4A0', // Primary
          500: '#8BB080',
          600: '#6E9A66',
          700: '#5A7E54',
          800: '#4A6545',
          900: '#3D5239',
        },
        // Terracotta palette
        terracotta: {
          50: '#FDF8F4',
          100: '#F9EDE4',
          200: '#F2D9C7',
          300: '#E5B894',
          400: '#D4A574', // Secondary
          500: '#C4956A',
          600: '#B08050',
          700: '#8B6340',
          800: '#6B4D33',
          900: '#4A3526',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        organic: '32px',
        'organic-lg': '40px',
        blob: '60% 40% 50% 50% / 45% 55% 45% 55%',
      },
      boxShadow: {
        organic: '0 8px 32px -8px rgba(167, 196, 160, 0.25)',
        'organic-lg': '0 16px 48px -12px rgba(167, 196, 160, 0.3)',
      },
    },
  },
  plugins: [],
};
