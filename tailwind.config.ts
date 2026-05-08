import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#faf8f5',
        gold: {
          50: '#fbf7e8',
          100: '#f5ecd0',
          200: '#ebd99f',
          300: '#dfc06a',
          400: '#d4af37',
          500: '#c9a227',
          600: '#a8861f',
          700: '#866818',
        },
        stone: {
          850: '#2c2825',
          950: '#1a1816',
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
export default config;
