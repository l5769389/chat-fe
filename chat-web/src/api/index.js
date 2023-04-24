import axios from "axios";
const service = axios.create({
    baseURL:'http://localhost:3000/api',
    timeout:6000,
})

service.interceptors.request.use(config => {
    return config
})

export default service