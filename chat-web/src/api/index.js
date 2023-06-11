import axios from "axios";
import sessionStore from '../utils/sessionStore'
import router from "@/router/router.js";
import {baseURL} from "/common/config.ts";

const service = axios.create({
    baseURL: baseURL,
    timeout: 6000,
})

service.interceptors.request.use(config => {
    const access_token = sessionStore.get('access_token')
    if (access_token) {
        config.headers.Authorization = `bearer ${access_token}`
    }
    return config
})
service.interceptors.response.use(async res => {
    if (res.data.access_token) {
        sessionStore.set('access_token', res.data.access_token)
    }
    return res.data
}, async error => {
    if (error.response.status === 401) {
        sessionStore.remove('access_token')
        await router.push({
            name: 'login'
        })
    }
})

export default service