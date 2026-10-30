const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const daisyThemes = require('daisyui/src/theming/themes');

// Brand scales built around the GURMAN logo: forest green #1F4B3A (700) and basket orange
// #E8A33D (400). They replace Tailwind's stock `emerald`/`amber` in place, so every existing
// `emerald-*` (primary) and `amber-*` (promo accent) utility follows the brand without a rename.
const forest = {
  50: '#eef5f0',
  100: '#d6e8dc',
  200: '#afd1bc',
  300: '#7fb497',
  400: '#529573',
  500: '#3a7a5a',
  600: '#2c6249',
  700: '#1f4b3a',
  800: '#193d30',
  900: '#143127',
  950: '#0c1f18',
};

const basketOrange = {
  50: '#fdf6ea',
  100: '#faeacd',
  200: '#f5d49b',
  300: '#f0bd69',
  400: '#e8a33d',
  500: '#d88b22',
  600: '#b86f17',
  700: '#935615',
  800: '#774517',
  900: '#623a17',
  950: '#381e08',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        emerald: forest,
        amber: basketOrange,
        // Warm cream page background from the brand sheet (the rest of the gray scale is stock).
        gray: { 50: '#f6f4ef' },
      },
      fontFamily: {
        // Wide heavy face of the wordmark: logo, hero and section headings only.
        display: ['"Unbounded"', ...defaultTheme.fontFamily.sans],
        // Handwritten "смачно щодня" accent; never for body copy.
        script: ['Caveat', 'cursive'],
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgb(15 23 42 / 0.08)',
      },
      keyframes: {
        'badge-pop': {
          '0%': { transform: 'scale(0.6)' },
          '60%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        'badge-pop': 'badge-pop 300ms ease-out',
        'slide-in-right': 'slide-in-right 250ms ease-out',
        'slide-in-left': 'slide-in-left 250ms ease-out',
        'fade-in': 'fade-in 200ms ease-out',
        'sheet-up': 'sheet-up 280ms cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    // Keeps the stock "light" theme but swaps its violet primary for the brand green so
    // DaisyUI components (toggle, progress, select focus) match the brand.
    themes: [
      {
        light: {
          ...daisyThemes.light,
          primary: forest[700],
          'primary-content': colors.white,
          accent: basketOrange[400],
          'accent-content': colors.slate[900],
          'base-content': colors.slate[800],
        },
      },
    ],
    logs: false,
  },
};
