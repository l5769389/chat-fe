<script setup>
import {SocketEvent, VIDEO_CLIENT_STATUS} from "/common/types.ts";
import hooks from './hooks.js'

const {invite_info, sendIpcMsg, setVideoStatus} = hooks();
const cancel = () => {
  setVideoStatus(VIDEO_CLIENT_STATUS.IDLE)
  const msg = {
    roomId: invite_info.videoRoomId,
    oppositeUserId: invite_info.oppositeUserId,
    answer: false,
  }
  sendIpcMsg({
    type: SocketEvent.ANSWER_INVITE,
    data: msg
  })
}
const confirm = () => {
  setVideoStatus(VIDEO_CLIENT_STATUS.BEINVITED)
  const msg = {
    userId: invite_info.value.userId,
    roomId: invite_info.value.videoRoomId,
    oppositeUserId: invite_info.value.oppositeUserId,
    answer: true,
  }
  sendIpcMsg({
    type: SocketEvent.ANSWER_INVITE,
    data: msg
  })
}

</script>

<template>
  <div class="w-full h-full">
    <el-button @click="cancel">拒绝</el-button>
    <el-button @click="confirm">接受</el-button>
  </div>
</template>

<style scoped>

</style>