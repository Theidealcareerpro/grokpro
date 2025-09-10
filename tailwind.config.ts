/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        'navy': {
          700: '#1E3A8A',
        },
        'slate': {
          200: '#E2E8F0',
        },
        'teal': {
          500: '#14B8A6',
          600: '#0F766E',
          700: '#0F766E',
        },
        'gray': {
          50: '#F9FAFB',
          600: '#4B5563',
          800: '#1F2937',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;