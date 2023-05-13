<template>
    <el-form
            label-position="left"
            label-width="100px"
            :model="loginForm"
    >
        <el-form-item label="Username">
            <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="Password">
            <el-input type="password" v-model="loginForm.password" />
        </el-form-item>
        <el-form-item>
            <el-button plain @click="login">Login</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import {reactive} from "vue";
import store from "@/store/index.js";
import {useRouter} from "vue-router";
const router = useRouter()
const loginForm = reactive({
    username:'',
    password:''
})

const login =async () => {
   await store.dispatch('login',loginForm)
   await router.push({
        name: 'home'
    })
}
</script>

<style scoped>

</style>