
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',  // ✅ This covers all files inside pages/ and Components/
  ],
  theme: {
    extend: {
      colors: {
        mrucha: '#4B1216',
        cream: '#FFEDDB',
        stroke: '#8C262A',
        blackish: '#100B08',
        blush: '#F9C5D1',
      },
      fontFamily: {
        asul: ['Asul', 'serif'],
        inter: ['Inter', 'sans-serif'],
        garamond: ['"Cormorant Garamond"', 'serif'],
      },
      width: {
        screen: '100vw',
      },
    },
  },
  plugins: [],




};
