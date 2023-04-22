const colors = require('tailwindcss/colors')
export default {
  darkMode: false, // or 'media' or 'class'
  content: [
    './*.html',
    './src/**/*.{js,jsx,ts,vue}'
  ],

  theme: {
    colors:{
      gray: colors.green
    },
    extend: {},
  },
  plugins: [],
}