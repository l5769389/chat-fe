<script setup>
import {Between_Main_Render_Events, SocketEvent, VIDEO_CLIENT_STATUS} from "/common/types.ts";
import hooks from "@video/hook/hooks.js";
import {ipcRenderer} from "electron";

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
const confirm = async () => {
  const screenInfo = await getScreenInfo();
  setVideoStatus(VIDEO_CLIENT_STATUS.BEINVITED)
  const msg = {
    userId: invite_info.value.userId,
    roomId: invite_info.value.videoRoomId,
    oppositeUserId: invite_info.value.oppositeUserId,
    answer: true,
    screenInfo: screenInfo,
  }
  sendIpcMsg({
    type: SocketEvent.ANSWER_INVITE,
    data: msg
  })
}
const getScreenInfo = async () => {
  const res = await ipcRenderer.invoke(Between_Main_Render_Events.render_to_main, 'getScreenInfo')
  return res;
}
// const getAllScreenInfo = async () => {
//   const res = await ipcRenderer.invoke(Between_Main_Render_Events.render_to_main)
//   return res;
// }

// const showWindowRef = ref(false)


</script>

<template>
  <div class="w-full h-full">
    <el-button @click="cancel">拒绝</el-button>
    <el-button @click="confirm">接受</el-button>
<!--    <div v-if="showWindowRef"></div>-->
  </div>
</template>

<style scoped>

</style>