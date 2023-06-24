<script setup lang="ts">
import {Close,Minus,FullScreen,Pushpin} from '@icon-park/vue-next';
import {ipcRenderer} from "electron";
import {useRouter, useRoute} from "vue-router";
import {Between_Main_Render_Events, MainEvent, WindowOperateMsg} from "../../common/types.js";
import {ref, watch} from "vue";

const pinRef = ref(false)
const winName = 'main'
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
const headerType = ref('grid')
const route = useRoute()
watch(() => route.name, (newVal,oldVal) => {
    if (newVal === 'login'){
        headerType.value = ''
    }else {
        headerType.value = 'grid'
    }
},{
  immediate: true
})
</script>

<template>
    <template v-if="headerType === 'grid'">
      <div class="w-[50px] h-full bg-dark draggable"></div>
      <div class="w-[230px] h-full bg-white-400 border-r-2 border-solid border-black draggable"></div>
      <div class="flex-1 h-full bg-white-400 flex items-center justify-end pr-5 space-x-[10px] draggable">
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
    </template>
    <template v-else>
      <div class="flex-1 h-full bg-white-400 flex items-center justify-end pr-5 space-x-[10px] draggable">
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
                size="15"
            ></component>
          </template>
        </div>
      </div>
    </template>
</template>

<style scoped>

</style>