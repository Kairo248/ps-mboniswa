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
