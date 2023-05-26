/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'index': '0px 0 40px 30px rgba(0, 0, 0, 1)',
      }
    },
  },
  plugins: [],
}
