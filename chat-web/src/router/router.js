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
    // 如果没有登录且前往的页面不是登录页面
    if (!isLogin && to.name !== 'login'){
        // 验证token
       const flag = await store.dispatch('checkLogin')
       if (flag){
           await store.dispatch('getRecentChatIds')
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