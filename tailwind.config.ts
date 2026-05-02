import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#C8102E',
          dark: '#A00D24',
          light: '#F5E6E9',
        },
        black: {
          DEFAULT: '#0A0A0A',
          soft: '#1A1A1A',
        },
        cream: '#F9F6F1',
        gold: '#B8962E',
        grey: {
          light: '#F3F3F3',
          mid: '#9CA3AF',
          dark: '#374151',
        },
      },
      fontFamily: {
        heading: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
