/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#ff7a18',
          pink: '#ff2d95',
          purple: '#7b5cff',
          navy: '#0b1a2b',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #ff7a18, #ff2d95, #7b5cff)',
      },
    },
  },
  plugins: [],
};