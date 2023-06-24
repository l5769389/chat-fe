import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router'
import {install} from '@icon-park/vue-next/es/all';
import '@icon-park/vue-next/styles/index.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Db from '@/plugin/db/dbPlugin.js'
import store from '@/store/index.js'
import webStorage from "@/utils/webStorage.js";


const app = createApp(App)

install(app)
install(app, 'i')
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(webStorage)

app.use(Db)
app.mount('#app')