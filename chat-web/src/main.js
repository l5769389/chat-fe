import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router'
import {install} from '@icon-park/vue-next/es/all';
import '@icon-park/vue-next/styles/index.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import SocketIo from '@/plugin/socket/socket.js'
import Db from '@/plugin/db/dbPlugin.js'
import store from '@/store/index.js'
import engine from 'store/src/store-engine';

const storages = [sessionStorage];
const sessionStore = engine.createStore(storages)
const app = createApp(App)
import {baseSocketIOURL} from "/common/config.ts";

install(app)
install(app, 'i')
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(sessionStore)
app.use(SocketIo, {
    connection: baseSocketIOURL,
    options: {
        autoConnect: false  //自动链接
    }
})
app.use(Db)
app.mount('#app')