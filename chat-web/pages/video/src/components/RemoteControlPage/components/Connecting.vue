<script setup>
import VideoController from "./VideoController.vue";
import hooks from '../../../hook/hooks.js'
import {SocketEvent} from "/common/types.ts";
import _ from 'lodash'

const {sendIpcMsg,invite_info,} = hooks();
const handleEvent = _.throttle((e) => {
  const msg = getMsg(e)
  sendIpcMsg(msg);
}, 10)
const getMsg = (e) => {
  const {type, clientX, clientY} = e;
  return {
    type: SocketEvent.REMOTE_CONTROL,
    data: {
      roomId: invite_info.value.videoRoomId,
      content: {
        type,
        clientX,
        clientY
      }
    }
  }
}
</script>

<template>
  <div class="w-full h-full relative">
    <div class="w-full h-full absolute top-0 left-0 bg-dark">
      <video ref="oppositeRef"
             autoplay
             playsinline
             @click="handleEvent"
             @mousedown="handleEvent"
             @mousemove="handleEvent"
             @mouseup="handleEvent"
             class="h-full object-contain"
      ></video>
    </div>

    <div class="w-5/6 absolute bottom-1/4 left-1/2 bg-black" style="transform: translateX(-50%)">
      <video-controller/>
    </div>

  </div>
</template>

<style scoped>

</style>