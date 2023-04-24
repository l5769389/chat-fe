const colors = require('tailwindcss/colors')
export default {
  darkMode: false, // or 'media' or 'class'
  content: [
    './*.html',
    './src/**/*.{js,jsx,ts,vue}'
  ],

  theme: {
    colors:{
      gray: colors.gray,
      active:colors.green
    },
    backgroundColor:theme => ({
      'dark-100':'rgb(247,247,247)',
      'dark-200':'rgb(225,224,224)',
      'dark-300':'rgb(197,197,195)',
      'dark':'rgb(46,46,46)',
    }),
    extend: {},
  },
  plugins: [],
}