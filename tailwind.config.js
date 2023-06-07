/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'index': '0px 0 40px 30px rgba(0, 0, 0, 1)',
      },
      colors: {
        'primary': '#cb2027',
        'secondary': '#7f7d82',
        'tertiary': '#a5a4a8',
      },
    },
  },
  plugins: [],
}
