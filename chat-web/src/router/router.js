import { createRouter, createWebHashHistory } from "vue-router"
import Home from '@/views/Home/Home.vue'
import Address from '@/views/Address/Address.vue'
import Layout from "@/layout/Layout.vue";
import Folder from '@/views/Folder/Folder.vue'
import Favorites from "@/views/Favorites/Favorites.vue";
import Friends from "@/views/Friends/Friends.vue";
const routes =[
    {
        path:'/',
        component: Layout,
        children:[
            {
                path: '/home',
                component: Home
            },
            {
                path: '/address',
                component: Address
            },
            {
                path: '/favorites',
                component: Favorites
            },
            {
                path: '/folder',
                component: Folder
            },
            {
                path: '/friends',
                component: Friends
            }
        ]
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router