/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agu: {
          primary: '#00529C',
          secondary: '#003366',
          accent: '#F37021',
        }
      }
    },
  },
  plugins: [],
}