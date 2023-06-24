const colors = require('tailwindcss/colors')
export default {
  darkMode: 'media', // or 'media' or 'class'
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
      active: '#07C160',
      white: colors.white,
      iconFill: '#979797'
    },
    fontSize: {
      sm: '12px',
      base: '14px',
      xl: '16px',
      '2xl': '18px',
      '3xl':'20px',
      '4xl':'22px',
      '5xl':'24px',
      '6xl':'26px',
    },
    backgroundColor: theme => ({
      'white': 'rgb(255,255,255)',
      'white-400': 'rgb(247,247,247)', //聊天列表页面背景，顶部，非列表区域
      'white-200': 'rgb(245,245,245)', //右侧聊天对话框背景
      'white-250': 'rgb(226,226,226)',
      'white-250-active': 'rgb(209,209,209)',
      'white-200-hover': 'rgb(215,215,215)', //白色聊天信息hover时候的颜色
      'white-200-active': 'rgb(235,235,235)', //白色聊天信息选中时候的颜色
      'white-300': 'rgb(228,228,228)', //聊天列表背景
      'white-400-hover': 'rgb(217,217,217)', // hover或者点击的时候聊天列表样式
      'white-400-active': 'rgb(199,199,199)', // hover或者点击的时候聊天列表样式


      'dark': 'rgb(46,46,46)',    // 左边黑色
      'dark-active': 'rgb(30,30,30)',    // 左边黑色 active
      'black':'rgb(0,0,0)',



      'green-100-hover': 'rgb(137,217,97)',
      'green-100': 'rgb(149,236,15)',
      'green':colors.green['500'],
      'green-hover':colors.green['600'],


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