/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Rubik', 'sans-serif'],
        screenplay: ['IBM Plex Mono', 'sans-serif']
      }
    },
  },
  plugins: [],
}