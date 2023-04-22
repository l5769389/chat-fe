import { createRouter, createWebHashHistory } from "vue-router"
import Home from '../views/Home.vue'
const routes =[
    {
        path:'/',component: Home
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router