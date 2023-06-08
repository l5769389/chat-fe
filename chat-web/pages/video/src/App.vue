<script setup>
import {ipcRenderer} from 'electron'
import VideoPop from "./components/VideoPop.vue";
import hooks from './components/components/hooks.js'

const {user, setUser} = hooks();
ipcRenderer.on('video-info', (event, args) => {
  console.log(args)
  setUser(args)
})
</script>

<template>
  <video-pop></video-pop>
</template>

<style scoped>

</style>
