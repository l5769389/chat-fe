import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";
import AutoImport from 'unplugin-auto-import/vite'
import {readFileSync} from 'fs';
import vueJsx from '@vitejs/plugin-vue-jsx'


export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue']
    }),
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
      '@': path.resolve('./src')
    }
  },
})
