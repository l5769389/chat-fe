<script setup lang="ts">
import {Close, Minus, FullScreen, Pushpin} from '@icon-park/vue-next';
import {ipcRenderer} from "electron";
import {Between_Main_Render_Events, MainEvent} from "../../../../common/types.js";
import {WindowOperateMsg} from "../../../../common/types.js";
import {ref} from "vue";


const pinRef = ref(false)
const winName = 'video'
const handlePin = () => {
  pinRef.value = !pinRef.value;
  sendOp({
    opType: MainEvent.window_pin,
    window: winName,
    value: pinRef.value
  })
}
const handleMinus = () => {
  sendOp({
    opType: MainEvent.window_minimize,
    window: winName,
  })
}
const handleFullScreen = () => {
  sendOp({
    opType: MainEvent.window_full,
    window: winName
  })
}
const handleClose = () => {
  sendOp({
    opType: MainEvent.window_close,
    window: winName
  })
}

const sendOp = (op: WindowOperateMsg) => {
  ipcRenderer.send(Between_Main_Render_Events.op_window, op)
}

const icons = [
  {
    icon: Pushpin,
    handler: handlePin
  },
  {
    icon: Minus,
    handler: handleMinus
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
    <div class="flex-1  bg-white-400 border-r-2 border-solid border-black draggable"></div>
    <div class="w-[150px] bg-white-400 flex items-center justify-end pr-5 space-x-[10px] draggable">
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