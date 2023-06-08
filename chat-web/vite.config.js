import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import {readFileSync} from 'fs';
import vueJsx from '@vitejs/plugin-vue-jsx'
import {getReplacer, viteElectronPlugin} from "./plugins/viteElectronPlugin.js";
import optimizer from "vite-plugin-optimizer";
import {buildPlugin} from "./plugins/buildPlugin.js";
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    optimizer(getReplacer()),
    viteElectronPlugin(),
    vueJsx({}),
  ],
  server:{
    host:'0.0.0.0',
    https: {
      key: readFileSync(path.resolve(path.join(__dirname,'/src/config/needIgnore/cert/localhost-key.pem'))),
      cert: readFileSync(path.resolve(path.join(__dirname,'/src/config/needIgnore/cert/localhost.pem')))
    }
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@capture': path.resolve('./pages/capture/src'),
      '@video': path.resolve('./pages/video/src'),
    }
  },
  build:{
    rollupOptions: {
      input: {
        main:path.resolve(__dirname,'index.html'),
        capture: path.resolve(__dirname,'pages/capture/index.html'),
        video: path.resolve(__dirname,'pages/video/index.html')
      },
      plugins: [buildPlugin()],
    },
  }
})
