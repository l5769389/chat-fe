<script setup>
import {inject, onMounted} from "vue";
import {useStore} from "vuex";
    const socket = inject('socket')
    const store = useStore()
    socket.on('connect',() => {
        socket.emit('events',{
            name: 'Nest'
        }, (data) =>console.log('收到响应'+ data))
    })
    store.dispatch('login')
    onMounted(() => {
        socket.connect()

    })
</script>

<template>
    <router-view></router-view>
</template>

<style scoped>
</style>
