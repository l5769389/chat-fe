<script setup>
import {Close,Minus,FullScreen,Pushpin} from '@icon-park/vue-next';
import {ipcRenderer} from "electron";


const pinRef = ref(false)
const handlePin = () => {
  pinRef.value = !pinRef.value;
  ipcRenderer.send('window_pin',pinRef.value)
}
const handleMinus = () => {
  console.log('min')
  ipcRenderer.send('window_minimize')
}
const handleFullScreen = () => {
  ipcRenderer.send('window_full')
}
const handleClose = () => {
  ipcRenderer.send('window_close')
}

const icons = [
  {
    icon: Pushpin,
    handler: handlePin
  },
  {
    icon: Minus,
    handler:handleMinus
  },
  {
    icon: FullScreen,
    handler: handleFullScreen
  },
  {
    icon: Close,
    handler: handleClose
  }
]
</script>

<template>
  <div class="w-full flex items-center">
    <div class="w-[50px] bg-dark draggable"></div>
    <div class="w-[230px] bg-dark-100 border-r-2 border-solid border-black draggable"></div>
    <div class="flex-1 bg-dark-100 flex items-center justify-end pr-5 space-x-[10px] draggable">
      <div v-for="item in icons" :key="item.icon" @click="item.handler" class="no-draggable">
        <template v-if="item.icon === Pushpin">
          <component
              :is="item.icon"
              theme="outline"
              size="18"
              :fill="pinRef ? '#22c55e': '#333'"
          ></component>
        </template>
        <template v-else>
          <component
              :is="item.icon"
              theme="outline"
              size="18"
          ></component>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>