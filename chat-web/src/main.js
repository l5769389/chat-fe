import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router'
import {install} from '@icon-park/vue-next/es/all';
import '@icon-park/vue-next/styles/index.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import SocketIo from '@/plugin/socket/socket.js'
import store from '@/store/index.js'

const app = createApp(App)
install(app)
install(app,'i')
app.use(router)
app.use(ElementPlus)
app.use(store)
app.use(SocketIo,{
    connection: 'http://localhost:3000',
})
app.mount('#app')