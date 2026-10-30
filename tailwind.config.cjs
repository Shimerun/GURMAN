const colors = require('tailwindcss/colors');
const daisyThemes = require('daisyui/src/theming/themes');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
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
    // Keeps the stock "light" theme but swaps its violet primary for emerald so
    // DaisyUI components (toggle, progress, select focus) match the brand.
    themes: [
      {
        light: {
          ...daisyThemes.light,
          primary: colors.emerald[600],
          'primary-content': colors.white,
          accent: colors.amber[400],
          'accent-content': colors.slate[900],
          'base-content': colors.slate[800],
        },
      },
    ],
    logs: false,
  },
};
