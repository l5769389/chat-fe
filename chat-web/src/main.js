import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router'
import {install} from '@icon-park/vue-next/es/all';
import '@icon-park/vue-next/styles/index.css';

const app = createApp(App)
install(app)
install(app,'i')
app.use(router)
app.mount('#app')