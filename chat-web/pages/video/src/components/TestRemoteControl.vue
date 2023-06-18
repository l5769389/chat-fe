<script setup>
import hooks from '../hook/hooks.js'

const {sendIpcMsg} = hooks();
import {SocketEvent} from "/common/types.ts";
import _ from 'lodash'

const handleEvent = _.throttle((e) => {
  const msg = getMsg(e)
  sendIpcMsg(msg);
}, 50)
const getMsg = (e) => {
  const {type, clientX, clientY} = e;
  return {
    type: SocketEvent.REMOTE_CONTROL,
    data: {
      roomId: '123',
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
  <div class="w-full h-full"
       @click="handleEvent"
       @mousedown="handleEvent"
       @mousemove="handleEvent"
       @mouseup="handleEvent"
  ></div>
</template>

<style scoped>

</style>