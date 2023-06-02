import { createApp } from 'vue'
import './style/style.css'
import App from './App.vue'
import { install } from '@icon-park/vue-next/es/all';
import '@icon-park/vue-next/styles/index.css';
const app = createApp(App)
install(app)
install(app, 'i')
createApp(App).mount('#app')
