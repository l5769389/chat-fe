<script setup>
import {inject} from "vue";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import {SocketEvent, VIDEO_CLIENT_STATUS} from "/common/types.ts";
import {useStore} from "vuex";
import rtcModalHook from "@/common/components/connectRtcDialog/rtcModalHook.js";
import {sendIpcMsg} from "@/utils/hooks/hooks.js";

const {invite_info} = modalVideoHooks();
const {closeVideoConnectPositive} = rtcModalHook()
const socket = inject("socket");
const store = useStore();
const cancel = () => {
  store.commit('setVideoStatus', VIDEO_CLIENT_STATUS.IDLE)
  const msg = {
    roomId: invite_info.videoRoomId,
    oppositeUserId: invite_info.oppositeUserId,
    answer: false,
  }
  closeVideoConnectPositive()
  sendIpcMsg({
    msg: {
      type: SocketEvent.ANSWER_INVITE,
      data: msg
    }
  })
}
const confirm = () => {
  store.commit('setVideoStatus', VIDEO_CLIENT_STATUS.BEINVITED)
  const msg = {
    userId: invite_info.userId,
    roomId: invite_info.videoRoomId,
    oppositeUserId: invite_info.oppositeUserId,
    answer: true,
  }
  sendIpcMsg({
    msg: {
      type: SocketEvent.ANSWER_INVITE,
      data: msg
    }
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