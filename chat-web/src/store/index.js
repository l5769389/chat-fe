import {createStore} from "vuex";
import service from "@/api/index.js";

export default createStore({
    state(){

    },
    mutations:{
        test(state,payload){
            console.log(payload)
        }
    },
    actions:{
       async login({commit,state}){
           await service.post('/login',{
               username:1,
               password:1
           })
        }
    }
})