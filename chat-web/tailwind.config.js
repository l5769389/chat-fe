const colors = require('tailwindcss/colors')
export default {
  darkMode: false, // or 'media' or 'class'
  content: [
    './*.html',
    './src/**/*.{js,jsx,ts,vue}'
  ],
  variants: {
    extend: {
      fill: ['hover','focus'] //开启fill的 hover状态
    }
  },

  theme: {
    colors: {
      gray: colors.gray,
      active: colors.green,
      white: colors.white
    },
    backgroundColor: theme => ({
      'dark-100': 'rgb(247,247,247)', //聊天列表页面背景，顶部，非列表区域
      'dark-200': 'rgb(245,245,245)', //右侧聊天对话框背景
      'dark-200-hover': 'rgb(215,215,215)', //白色聊天信息hover时候的颜色
      'dark-200-active': 'rgb(235,235,235)', //白色聊天信息选中时候的颜色
      'dark-300': 'rgb(228,228,228)', //聊天列表背景

      'dark-400-hover': 'rgb(217,217,217)', // hover或者点击的时候聊天列表样式 
      'dark-400-active': 'rgb(199,199,199)', // hover或者点击的时候聊天列表样式 
      'dark': 'rgb(46,46,46)',    // 左边黑色
      'white': 'rgb(255,255,255)',
      'green-100-hover': 'rgb(137,217,97)',
      'green-100': 'rgb(149,236,15)',
      'black':'rgb(0,0,0)',
      'red': colors.red["500"]
    }),
    extend: {
      zIndex: {
        '-1': '-1'
      }
    },
  },
  plugins: [],
}