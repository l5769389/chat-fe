import { createRouter, createWebHashHistory } from "vue-router"
import Home from '@/views/Home/Home.vue'
import Address from '@/views/Address/Address.vue'
import Layout from "@/layout/Layout.vue";
import Folder from '@/views/Folder/Folder.vue'
import Favorites from "@/views/Favorites/Favorites.vue";
import Friends from "@/views/Friends/Friends.vue";
import Login from '@/views/Login/Login.vue'
import store from '../store/index.js'
const routes =[
    {
        path:'/',
        component: Layout,
        children:[
            {
                path: '/',
                name: 'home',
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
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})
router.beforeEach(async (to, from, next) => {
    const isLogin = store.getters.isLogin
    if (!isLogin && to.name !== 'login'){
       const flag = await store.dispatch('checkLogin')
       if (flag){
           next()
       } else {
           next({
               name: 'login'
           })
       }
    }else {
        next()
    }
})


export default router