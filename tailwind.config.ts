import type { Config } from 'tailwindcss'
import scrollbarHide from 'tailwind-scrollbar-hide'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Rubik', 'sans-serif'],
        screenplay: ['IBM Plex Mono', 'sans-serif'],
      },
    },
  },
  plugins: [
    scrollbarHide,
  ],
} satisfies Config