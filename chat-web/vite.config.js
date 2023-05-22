import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";
import AutoImport from 'unplugin-auto-import/vite'
import {readFileSync} from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue']
    })
  ],
  server:{
    // proxy:{
    //   '/api/*':{
    //     target: 'https://localhost:3000',
    //     changeOrigin:true
    //   },
    // },
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
  }
})
