<script setup>
import {inject} from "vue";
import {ANSWER_INVITE} from "@/config/config.js";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
const {invite_info} = modalVideoHooks();
const socket = inject("socket");

const cancel = () =>{}
const confirm = () =>{
    const msg = {
        roomId: invite_info.videoRoomId,
        oppositeUserId: invite_info.oppositeUserId,
        answer: true,
    }
    console.log(JSON.stringify(msg))
  socket.emit(ANSWER_INVITE, msg);
}
</script>

<template>
  <div class="w-full h-full">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="confirm">接受</el-button>
  </div>
</template>

<style scoped>

</style>