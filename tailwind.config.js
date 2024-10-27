/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mivCol: '#FFCF21', 
      },
      fontFamily: {
        dirtyline: ['Dirtyline', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}

