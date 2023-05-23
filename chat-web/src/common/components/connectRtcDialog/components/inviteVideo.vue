<script setup>
import {inject} from "vue";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import {SocketEvent} from "@/config/config.js";
const {invite_info,hideVideoModal} = modalVideoHooks();
const socket = inject("socket");

const cancel = () =>{
  const msg = {
    roomId: invite_info.videoRoomId,
    oppositeUserId: invite_info.oppositeUserId,
    answer: false,
  }
  hideVideoModal()
  socket.emit(SocketEvent.ANSWER_INVITE, msg);
}
const confirm = () =>{
    const msg = {
        roomId: invite_info.videoRoomId,
        oppositeUserId: invite_info.oppositeUserId,
        answer: true,
    }
  socket.emit(SocketEvent.ANSWER_INVITE, msg);
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