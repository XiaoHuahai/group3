import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#f8fafc'
        },
        muted: '#f1f5f9',
        accent: '#38bdf8'
      }
    }
  },
  plugins: []
};

export default config;

