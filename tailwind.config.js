/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      xs: '500px',
      ...defaultTheme.screens
    },
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'roboto-extended': ['Roboto', 'sans-serif']
      },
      colors: {
        'main-background': 'rgb(var(--main-background) / <alpha-value>)',
        'dark-primary': '#E7E9EA',
        'dark-secondary': '#71767B',
        'light-primary': '#0F1419',
        'light-secondary': '#536471',
        'dark-border': '#2F3336',
        'light-border': '#EFF3F4',
      }
    },
  },
  plugins: [
    ({ addVariant }) => {
      addVariant('inner', '& > *');
    }
  ],
}
